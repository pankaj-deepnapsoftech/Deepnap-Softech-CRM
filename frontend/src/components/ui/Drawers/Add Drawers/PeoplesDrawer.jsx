import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import {toast} from 'react-toastify';
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CustomSelect from "../../CustomSelect";

const PeoplesDrawer = ({closeDrawerHandler, fetchAllPeople}) => {
  const [cookies] = useCookies();
  const [companies, setCompanies] = useState([]);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  // const [companyId, setCompanyId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [adding, setAdding] = useState(false);

  const dispatch = useDispatch();

  const addPeopleHandler = async (e)=>{
    e.preventDefault();

    if(firstname.length > 25){
      toast.error('Firstname field must be less than 25 characters long');
      return;
    }
    if(lastname.length > 25){
      toast.error('Lastname field must be less than 25 characters long');
      return;
    }
    if(phone.length > 10){
      toast.error('Phone no. field must be 10 digits long');
      return;
    }

    try{
      setAdding(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL+"people/create-people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
          // company: companyId,
          phone: phone
        })
      })

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }

      fetchAllPeople();
      closeDrawerHandler();
      toast.success(data.message);
    }
    catch(err){
      toast.error(err.message);
    }
    finally{
      setAdding(false);
    }
  }

  const getAllCompanies = async ()=>{
    try{
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL+'company/all-companies', {
        method: "POST",
        headers: {
          "authorization": `Bearer ${cookies?.access_token}`
        }
      })

      const data = await response.json();

      if(!data.success){
        throw new Error(data.message);
      }

      setCompanies(data.companies);
    }
    catch(err){
      toast(err.message);
    }
  }

  useEffect(()=>{
    getAllCompanies();
  }, []);

  return (
    <div className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3" style={{boxShadow: "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px"}}>
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b"><BiX onClick={closeDrawerHandler} size="26px" />Individuals</h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">Add New Individual</h2>

        <form onSubmit={addPeopleHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Firstname</FormLabel>
            <Input value={firstname} onChange={(e)=>setFirstname(e.target.value)} type="text" placeholder="Firstname" />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Lastname</FormLabel>
            <Input value={lastname} onChange={(e)=>setLastname(e.target.value)} type="text" placeholder="Lastname" />
          </FormControl>
          <FormControl className="mt-2 mb-5">
            {/* <FormLabel fontWeight="bold">Corporate</FormLabel>
            <Select value={companyId} onChange={(e)=>setCompanyId(e.target.value)} placeholder="Select corporate">
              {companies.map(company => <option key={company._id} value={company._id}>{company.companyname}</option>)}
            </Select> */}
            {/* <CustomSelect data={companies} idAccessor={'_id'} nameAccessor={"companyname"} label={"Corporate"} placeholder={"Select corporate"} value={companyId} setValue={setCompanyId} /> */}
          </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Phone</FormLabel>
            <Input className="no-scrollbar" value={phone} onChange={(e)=>setPhone(e.target.value)} type="number" placeholder="Phone" />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" />
          </FormControl>
            <Button
              isLoading={adding}
              type="submit"
              className="mt-1" 
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
        </form>
      </div>
    </div>
  );
};

export default PeoplesDrawer;
