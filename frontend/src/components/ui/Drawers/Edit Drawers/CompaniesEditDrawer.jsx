import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Loading from "../../Loading";

const CompaniesEditDrawer = ({ dataId: id, closeDrawerHandler, fetchAllCompanies }) => {
  const [peoples, setPeoples] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const editCompanyHandler = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "company/edit-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          companyId: id,
          companyname: name,
          email: email,
          contact: contact,
          phone: phone,
          website: website,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllCompanies();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally{
      setUpdating(false);
    }
  };

  const getAllPeoples = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "people/all-persons", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setPeoples(data.people);
    } catch (err) {
      toast(err.message);
    }
  };
  

  const fetchCompanyDetails = async ()=>{
    setIsLoading(true);
    try{
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(baseUrl+'company/company-details', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies?.access_token}`
            },
            body: JSON.stringify({
                companyId: id
            })
        })

        const data = await response.json();

        if(!data.success){
            throw new Error(data.message);
        }
 
        setName(data.company?.companyname);
        setEmail(data.company?.email);
        setContact(data.company?.contact);
        setPhone(data.company?.phone);
        setWebsite(data.company?.website);

        setIsLoading(false);
    }
    catch(err){
        toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchCompanyDetails();
    getAllPeoples();
  }, []);

  return (
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Corporate
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Edit Corporate
        </h2>

        {isLoading && <Loading />}
        {!isLoading && <form onSubmit={editCompanyHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </FormControl>
          <FormControl className="mt-2 mb-5">
            <FormLabel fontWeight="bold">Contact</FormLabel>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              placeholder="Name"
            />
            {/* <Select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              placeholder="Select contact"
            >
              {peoples.map((people) => (
                <option key={people._id} value={people._id}>
                  {people.firstname + " " + people.lastname}
                </option>
              ))}
            </Select> */}
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Phone</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              className="no-scroll"
              placeholder="Phone"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Website</FormLabel>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              type="text"
              placeholder="Website"
            />
          </FormControl>
          <Button
            isLoading={updating}
            type="submit"
            className="mt-1"
            color="white"
            backgroundColor="#1640d6"
          >
            Submit
          </Button>
        </form>}
      </div>
    </div>
  );
};

export default CompaniesEditDrawer;
