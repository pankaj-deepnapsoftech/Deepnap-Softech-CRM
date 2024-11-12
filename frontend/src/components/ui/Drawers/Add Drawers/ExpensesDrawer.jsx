import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddExpensesDrawer } from "../../../../redux/reducers/misc";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

const ExpensesDrawer = ({fetchAllExpenses, closeDrawerHandler}) => {
  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState();
  const [categoryOptions, setCategoryOptions] = useState();
  const [total, setTotal] = useState("");
  const [description, setDescription] = useState("");
  const [ref, setRef] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const getAllCategories = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "expense-category/all-categories", {
        method: "POST",
        headers: {
          "authorization": `Bearer ${cookies?.access_token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setCategories(data.categories);
    } catch (err) {
      toast(err.message);
    }
  };

  const addExpenseHandler = async (e) => {
    e.preventDefault();

    try {
      setAdding(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "expense/create-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${cookies?.access_token}`
        },
        body: JSON.stringify({
          name, categoryId: category?.value, description, ref, price: total
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      closeDrawerHandler();
      fetchAllExpenses();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally{
      setAdding(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  
  useEffect(()=>{
    let options = [{value: 'Add Category', label: '+ Add Category'}];
    options = options.concat(categories.map((data) => {
      return { value: data._id, label: data.categoryname };
    }));
    setCategoryOptions(options);
  }, [categories]);

  return (
    <div className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3" style={{boxShadow: "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px"}}>
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Expense
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Add New Expense
        </h2>

        <form onSubmit={addExpenseHandler}>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </FormControl>
          <div className="mt-2 mb-5">
              <label className="font-bold">Category</label>
              <Select
                className="rounded mt-2"
                options={categoryOptions}
                placeholder="Select category"
                value={category}
                onChange={(d) => {
                  if(d.value === 'Add Category'){
                    closeDrawerHandler();
                    navigate('/crm/expenses-category');
                  }
                  setCategory(d);
                }}
                isSearchable={true}
              />
            </div>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Total</FormLabel>
            <Input
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              type="number"
              placeholder="Total"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              resize="none"
            />
          </FormControl>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Ref</FormLabel>
            <Input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              type="text"
              placeholder="Ref"
            />
          </FormControl>
          <Button isLoading={adding} type="submit" className="mt-1" color="white" backgroundColor="#1640d6">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExpensesDrawer;
