import {
  Button,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Input,
  Textarea,
  typography,
  useStatStyles,
} from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { closeAddLeadsDrawer } from "../../../../redux/reducers/misc";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const LeadsDrawer = ({ fetchAllLeads, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [companies, setCompanies] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  const [adding, setAdding] = useState(false);

  const [productOptionsList, setProductOptionsList] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [showSelectPeoples, setShowSelectPeoples] = useState(true);
  const [showSelectCompanies, setShowSelectCompanies] = useState(true);

  const [peopleOptionsList, setPeopleOptionsList] = useState();
  const [selectedPeopleOption, setPeopleSelectedOption] = useState();

  const [employeeOptionsList, setEmployeeOptionsList] = useState();
  const [selectedEmployeeOption, setEmployeeSelectedOption] = useState();

  const [companyOptionsList, setCompanyOptionsList] = useState();
  const [selectedCompanyOption, setSelectedCompanyOption] = useState();

  const typeOptionsList = [
    { value: "Company", label: "Corporate" },
    { value: "People", label: "Individual" },
  ];

  const statusOptionsList = [
    { value: "Draft", label: "Draft" },
    { value: "New", label: "New" },
    { value: "In Negotiation", label: "In Negotiation" },
    { value: "Completed", label: "Completed" },
    { value: "Loose", label: "Loose" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Assigned", label: "Assigned" },
    { value: "On Hold", label: "On Hold" },
    { value: "Follow Up", label: "Follow Up" },
  ];
  const sourceOptionsList = [
    { value: "Linkedin", label: "Linkedin" },
    { value: "Social Media", label: "Social Media" },
    { value: "Website", label: "Website" },
    { value: "Advertising", label: "Advertising" },
    { value: "Friend", label: "Friend" },
    { value: "Professionals Network", label: "Professionals Network" },
    { value: "Customer Referral", label: "Customer Referral" },
    { value: "Sales", label: "Sales" },
  ];

  const [typeId, setTypeId] = useState();

  const [statusId, setStatusId] = useState();

  const [sourceId, setSourceId] = useState();

  const [peopleId, setPeopleId] = useState();

  const [companyId, setCompanyId] = useState();

  const [notes, setNotes] = useState("");

  const [assigned, setAssigned] = useState();

  const [followupDate, setFollowupDate] = useState();

  const [followupReason, setFollowupReason] = useState();

  const navigate = useNavigate();

  const getAllCompanies = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "company/all-companies", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setCompanies(data.companies);
    } catch (err) {
      toast(err.message);
    }
  };

  const getAllProducts = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "product/all-products", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setProducts(data.products);
    } catch (err) {
      toast(err.message);
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

  const getAllEmployees = async () => {
    try {
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "admin/all-admins", {
        method: "GET",
        headers: {
          authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setEmployees(data.admins);
    } catch (err) {
      toast(err.message);
    }
  };

  const addLeadHandler = async (e) => {
    e.preventDefault();

    if (!typeId?.value) {
      toast.error("Type not selected");
      return;
    }
    if (!peopleId?.value && !companyId?.value) {
      toast.error("Individual/Corporate not selected");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Atleast 1 product should be selected");
      return;
    }
    if (statusId?.value === "Follow Up" && (!followupDate || !followupReason || followupReason === '')) {
      toast.error("Follow-up date and Follow-up reason required");
      return;
    }

    const productsId = selectedProducts.map((p) => p?.value);
    let body = {};
    if (
      statusId?.value === "Assigned" &&
      assigned?.value &&
      assigned?.value !== ""
    ) {
      body = JSON.stringify({
        leadtype: typeId?.value,
        status: statusId?.value,
        source: sourceId?.value,
        peopleId: peopleId?.value,
        companyId: companyId?.value,
        products: productsId,
        notes,
        assigned: assigned?.value,
      });
    } else if (
      statusId?.value === "Follow Up" &&
      followupDate &&
      followupReason
    ) {
      body = JSON.stringify({
        leadtype: typeId?.value,
        status: statusId?.value,
        source: sourceId?.value,
        peopleId: peopleId?.value,
        companyId: companyId?.value,
        products: productsId,
        notes,
        assigned: assigned?.value,
        followup_date: followupDate,
        followup_reason: followupReason,
      });
    } else {
      body = JSON.stringify({
        leadtype: typeId?.value,
        status: statusId?.value,
        source: sourceId?.value,
        peopleId: peopleId?.value,
        companyId: companyId?.value,
        products: productsId,
        notes,
      });
    }

    try {
      setAdding(true);
      const baseURL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseURL + "lead/create-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: body,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      fetchAllLeads();
      closeDrawerHandler();
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally{
      setAdding(false);
    }
  };

  useEffect(() => {
    getAllCompanies();
    getAllPeoples();
    getAllProducts();
    getAllEmployees();
  }, []);

  useEffect(() => {
    let options = [{ value: "Add Individual", label: "+ Add Individual" }];
    options = options.concat(
      peoples.map((data) => {
        return {
          value: data._id,
          label: data?.firstname + " " + data?.lastname,
        };
      })
    );
    setPeopleOptionsList(options);
  }, [peoples]);

  useEffect(() => {
    let options = [{ value: "", label: "None" }];
    options = options.concat(
      employees.map((data) => {
        return {
          value: data._id,
          label: data?.name,
        };
      })
    );
    setEmployeeOptionsList(options);
  }, [employees]);

  useEffect(() => {
    let options = [{ value: "Add Corporate", label: "+ Add Corporate" }];
    options = options.concat(
      companies.map((data) => {
        return { value: data._id, label: data.companyname };
      })
    );
    setCompanyOptionsList(options);
  }, [companies]);

  useEffect(() => {
    let options = [{ value: "Add Product", label: "+ Add Product" }];
    options = options.concat(
      products.map((data) => {
        return { value: data._id, label: data.name };
      })
    );
    setProductOptionsList(options);
  }, [products]);

  useEffect(() => {
    setShowSelectPeoples(typeId?.label === "Individual" ? true : false);
    setShowSelectCompanies(typeId?.label === "Corporate" ? true : false);
    setPeopleId();
    setCompanyId();
  }, [typeId]);

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
        Lead
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Add New Lead
        </h2>

        <form onSubmit={addLeadHandler}>
          <div className="mt-2 mb-5">
            <label className="font-bold">Type</label>
            <Select
              className="rounded mt-2"
              options={typeOptionsList}
              placeholder="Select type"
              value={typeId}
              onChange={(d) => {
                setTypeId(d);
              }}
              isSearchable={true}
            />
          </div>

          <div className="mt-2 mb-5">
            <label className="font-bold">Status</label>
            <Select
              className="rounded mt-2"
              options={statusOptionsList}
              placeholder="Select status"
              value={statusId}
              onChange={(d) => {
                // setStatusLabel(d);
                setStatusId(d);
              }}
              isSearchable={true}
            />
          </div>

          {statusId?.value === "Assigned" && (
            <div className="mt-2 mb-5">
              <label className="font-bold">Assigned</label>
              <Select
                required={statusId?.value === "Assigned"}
                className="rounded mt-2"
                options={employeeOptionsList}
                placeholder="Select employee"
                value={assigned}
                onChange={(d) => {
                  setAssigned(d);
                }}
                isSearchable={true}
              />
            </div>
          )}

          <div className="mt-2 mb-5">
            <label className="font-bold">Source</label>
            <Select
              className="rounded mt-2"
              options={sourceOptionsList}
              placeholder="Select source"
              value={sourceId}
              onChange={(d) => {
                // setSourceLabel(d);
                setSourceId(d);
              }}
              isSearchable={true}
            />
          </div>

          <div className="mt-2 mb-5">
            <label className="font-bold">Products</label>
            <Select
              required={true}
              className="rounded mt-2"
              options={productOptionsList}
              placeholder="Select products"
              value={selectedProducts}
              onChange={(d) => {
                if (d[d.length - 1]?.value === "Add Product") {
                  closeDrawerHandler();
                  navigate("/crm/products");
                }
                setSelectedProducts(d);
              }}
              isSearchable={true}
              isMulti={true}
            />
          </div>

          {(showSelectPeoples || !typeId) && (
            <div className="mt-2 mb-5">
              <label className="font-bold">Individual</label>
              <Select
                className="rounded mt-2"
                options={peopleOptionsList}
                placeholder="Select individual"
                value={peopleId}
                onChange={(d) => {
                  if (d.value === "Add Individual") {
                    closeDrawerHandler();
                    navigate("/crm/individuals");
                  }
                  setPeopleId(d);
                  // setPeopleLabel(d);
                }}
                isSearchable={true}
              />
            </div>
          )}

          {(showSelectCompanies || !typeId) && (
            <div className="mt-2 mb-5">
              <label className="font-bold">Corporate</label>
              <Select
                className="rounded mt-2"
                options={companyOptionsList}
                placeholder="Select corporate"
                value={companyId}
                onChange={(d) => {
                  if (d.value === "Add Corporate") {
                    closeDrawerHandler();
                    navigate("/crm/corporates");
                  }
                  setCompanyId(d);
                  // setCompanyLabel(d);
                }}
                isSearchable={true}
              />
            </div>
          )}
          {statusId?.value === "Follow Up" && (
            <>
              <FormControl className="mt-2 mb-5">
                <FormLabel fontWeight="bold">Follow-up Date</FormLabel>
                <Input
                  type="date"
                  value={followupDate}
                  min={new Date().toISOString().substring(0, 10)}
                  onChange={(e) => setFollowupDate(e.target.value)}
                />
              </FormControl>
              <FormControl className="mt-2 mb-5">
                <FormLabel fontWeight="bold">Follow-up Reason</FormLabel>
                <Input
                  type="text"
                  value={followupReason}
                  onChange={(e) => setFollowupReason(e.target.value)}
                />
              </FormControl>
            </>
          )}
          <FormControl className="mt-2 mb-5">
            <FormLabel fontWeight="bold">Remarks</FormLabel>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              resize="none"
            />
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

export default LeadsDrawer;
