import { Button, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Td } from "@chakra-ui/react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Loading from "../ui/Loading";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const { role, allowedroutes } = useSelector((state) => state.auth);
  const [cookies] = useCookies();
  const today = new Date();
  const [startDate, setStartDate] = useState(
    new Date(`${today.getMonth() + 1}/02/${today.getFullYear()}`)
      .toISOString()
      .substring(0, 10)
  );
  const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10));

  const durationOptionsList = [
    { value: "This month", label: "This month" },
    { value: "Last 3 months", label: "Last 3 months" },
    { value: "Last 6 months", label: "Last 6 months" },
    { value: "This Year", label: "This Year" },
  ];
  const [selectedDuration, setSelectedDuration] = useState({
    value: "This month",
    label: "This month",
  });

  const [invoiceStatus, setInvoiceStatus] = useState([]);
  const [proformaInvoiceStatus, setProformaInvoiceStatus] = useState([]);
  const [offerStatus, setOfferStatus] = useState([]);
  const [totalInvoiceStatus, setTotalInvoiceStatus] = useState(0);
  const [totalInvoicePaymentStatus, setTotalInvoicePaymentStatus] = useState(0);
  const [totalProformaInvoice, setTotalProformaInvoice] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  

  const [totalOffer, setTotalOffer] = useState(0);
  // const [totalInvoices, setTotalInvoices] = useState(0);
  // const [totalProformaInvoices, setTotalProformaInvoices] = useState(0);


  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalUnpaidInvoiceAmount, setTotalUnpaidInvoiceAmount] = useState(0);
  const [totalProformaInvoiceAmount, setTotalProformaInvoiceAmount] =
    useState(0);
  const [totalOfferAmount, setTotalOfferAmount] = useState(0);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [followupLeads, setFollowupLeads] = useState(0);
  const [completedLeads, setCompletedLeads] = useState(0);
  const [cancelledLeads, setCancelledLeads] = useState(0);

  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [productDropdown, setProductDropdown] = useState(false);
  const [followupDropdown, setFollowupDropdown] = useState(false);

  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalProformaInvoices, setTotalProformaInvoices] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);

  const progressStyles = {
    draft: {
      bg: "#6a6a6a",
    },
    pending: {
      bg: "#f17f7f",
    },
    sent: {
      bg: "#41ad5e",
    },
    unpaid: {
      bg: "#f17f7f",
    },
    declined: {
      bg: "#6a6a6a",
    },
    "partially paid": {
      bg: "#ff8b46",
    },
    paid: {
      bg: "#41ad5e",
    },
    accepted: {
      bg: "#41ad5e",
    },
  };

  const fetchInvoiceStats = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/invoice-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setInvoiceStatus(data.invoices);
      setTotalInvoiceStatus(data.totalInvoiceStatus);
      setTotalInvoicePaymentStatus(data.totalInvoiceStatus);
      setTotalInvoices(data.totalInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchProformaInvoiceStats = async (from, to) => {
    try {
      const response = await fetch(
        baseUrl + "dashboard/proforma-invoice-summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            fromDate: from,
            toDate: to,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setProformaInvoiceStatus(data.proformaInvoices);
      setTotalProformaInvoice(data.totalProformaInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchOfferStats = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/offer-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setOfferStatus(data.offers);
      setTotalOffer(data.totalOffers);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchTotalCustomer = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/customer-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setTotalCustomer(data.totalCustomers);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAmountSummary = async (from, to) => {
    try {
      const response = await fetch(baseUrl + "dashboard/amount-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          fromDate: from,
          toDate: to,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setTotalInvoiceAmount(data.totalInvoiceAmount);
      setTotalUnpaidInvoiceAmount(data.totalUnpaidInvoiceAmount);
      setTotalProformaInvoiceAmount(data.totalProformaInvoiceAmount);
      setTotalOfferAmount(data.totalOfferAmount);

      setTotalInvoices(data.totalInvoices);
      setTotalUnpaidInvoices(data.totalUnpaidInvoices);
      setTotalOffers(data.totalOffers);
      setTotalProformaInvoices(data.totalProformaInvoices);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/product-summary",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setProducts(data.products);
      setCategories(data.categories);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // const fetchFollowUpStats = async (from, to) => {
  //   try {
  //     const response = await fetch(
  //       process.env.REACT_APP_BACKEND_URL + "dashboard/followup-summary",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${cookies?.access_token}`,
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           fromDate: from,
  //           toDate: to,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (!data.success) {
  //       throw new Error(data.message);
  //     }
  //     setFollowups(data.leads);
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  const fetchLeadStats = async (from, to) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard/leads-summary",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromDate: from,
            toDate: to,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFollowupLeads(data.leads['Follow Up']);
      setCompletedLeads(data.leads['Completed']);
      setCancelledLeads(data.leads['Cancelled']);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchAllData = async (from, to) => {
    setInvoiceStatus([]);
    setProformaInvoiceStatus([]);
    setOfferStatus([]);
    setTotalInvoiceAmount(0);
    setTotalCustomer(0);
    setTotalInvoicePaymentStatus(0);
    setTotalProformaInvoiceAmount(0);
    setTotalOfferAmount(0);
    setTotalUnpaidInvoiceAmount(0);
    setTotalInvoices(0);
    setTotalOffers(0);
    setTotalProformaInvoices(0);
    setTotalLeads(0)

    fetchInvoiceStats(from, to);
    fetchProformaInvoiceStats(from, to);
    fetchOfferStats(from, to);
    fetchTotalCustomer(from, to);
    fetchAmountSummary(from, to);
    // fetchFollowUpStats(from, to);
    fetchProductStats();
    fetchLeadStats(from, to);
  };

  const filterBasedOnDate = async () => {
    const start = startDate.split("-");
    const end = endDate.split("-");

    let fromDate = moment().set({
      date: start[2],
      month: start[1] - 1,
      year: start[0],
      hour: 0,
      minutes: 0,
      seconds: 0,
    })._d;
    let toDate = moment().set({
      date: end[2],
      date: end[1] - 1,
      year: end[0],
      hour: 23,
      minutes: 59,
      seconds: 59,
    })._d;

    fetchAllData(fromDate, toDate);
  };

  const filterBasedOnDuration = async () => {
    let fromDate;
    let toDate;

    switch (selectedDuration?.value) {
      case "This month":
        toDate = new Date();
        fromDate = moment().set({
          date: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })._d;
        break;
      case "Last 3 months":
        toDate = new Date();
        fromDate = moment()
          .subtract(3, "months")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
      case "Last 6 months":
        toDate = new Date();
        fromDate = moment()
          .subtract(6, "months")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
      default:
        toDate = new Date();
        fromDate = moment()
          .subtract(1, "year")
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
        break;
    }

    fetchAllData(fromDate, toDate);
  };

  useEffect(() => {
    filterBasedOnDuration();
  }, []);

  return (
    <>
      {(role !== 'Super Admin' && !allowedroutes.includes("dashboard")) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin for
          further action.
        </div>
      )}

      {(role === 'Super Admin' || allowedroutes.includes("dashboard")) && (
        <div>
          <div className="flex flex-wrap gap-x-2 justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                filterBasedOnDate();
              }}
              className="grid grid-cols-3 gap-x-2 items-center"
            >
              <FormControl>
                <FormLabel fontWeight="bold">From</FormLabel>
                <Input
                  backgroundColor="white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  placeholder="Date"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">To</FormLabel>
                <Input
                  backgroundColor="white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  placeholder="Date"
                  min={startDate}
                />
              </FormControl>
              <Button
                type="submit"
                className="mt-7"
                color="white"
                backgroundColor="#1640d6"
              >
                Apply
              </Button>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                filterBasedOnDuration();
              }}
              className="grid grid-cols-2 gap-x-2 items-center"
            >
              <div className="mt-2 mb-5 pt-2">
                <label className="font-bold">Duration</label>
                <Select
                  className="rounded mt-2"
                  options={durationOptionsList}
                  placeholder="Select duration"
                  value={selectedDuration}
                  onChange={(d) => {
                    setSelectedDuration(d);
                  }}
                  isSearchable={true}
                />
              </div>
              <Button
                type="submit"
                className="mt-7"
                color="white"
                backgroundColor="#1640d6"
              >
                Apply
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
            
            <Link to='invoices'><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div></Link>

            <Link to='proforma-invoices'><div
              style={{ boxShadow: "0 0 20px 3px  #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b font-bold pb-4 text-[#22075e]">
                Proforma Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#41ad5e] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalProformaInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div></Link>
            <Link to='offers'><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b font-bold pb-4 text-[#22075e]">
                Offers
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#ff8b46] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalOfferAmount.toFixed(2)}
                </span>
              </div>
            </div></Link>
            <div
              onClick={()=>navigate('invoices', {state: {searchKey: 'Unpaid Invoices'}})}
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7 cursor-pointer"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Unpaid Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  Rs {totalUnpaidInvoiceAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
          <Link to='invoices'><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Total Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold font-bold text-[#595959]">
              <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {totalInvoices}
                </span>
              </div>
            </div></Link>
            <Link to='proforma-invoices'><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-lg border-b font-bold pb-4 text-[#22075e]">
                Total Proforma Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
              <span className="bg-[#41ad5e] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {totalProformaInvoices}
                </span>
              </div>
            </div></Link>
            <Link to='offers'><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b font-bold pb-4 text-[#22075e]">
                Total Offers
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff8b46] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {totalOffers}
                </span>
              </div>
            </div></Link>
            <div
              onClick={()=>navigate('invoices', {state: {searchKey: 'Unpaid Invoices'}})}
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7 cursor-pointer"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Total Unpaid Invoices
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {totalUnpaidInvoices}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
            {/* <Link to="products-category"><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Total Categories
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                All Time
                <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {categories.length}
                </span>
              </div>
            </div></Link> */}
            <Link to="products"><div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b font-bold pb-4 text-[#22075e]">
                Total Products
                <MdKeyboardArrowRight size={25} />
                {/* {!productDropdown && (
                  <FaChevronDown onClick={() => setProductDropdown(true)} />
                )}
                {productDropdown && (
                  <FaChevronUp onClick={() => setProductDropdown(false)} />
                )} */}
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                All Time
                <span className="bg-[#41ad5e] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {products.length}
                </span>
              </div>
            </div></Link>
            <div
            onClick={()=>navigate('leads', {state: {searchKey: 'Follow Up'}})}
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7 cursor-pointer"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b font-bold pb-4 text-[#22075e]">
                Follow-Up Leads
                <MdKeyboardArrowRight size={25} />
                {/* {!followupDropdown && (
                  <FaChevronDown onClick={() => setFollowupDropdown(true)} />
                )}
                {followupDropdown && (
                  <FaChevronUp onClick={() => setFollowupDropdown(false)} />
                )} */}
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#ff8b46] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {followupLeads}
                </span>
              </div>
            </div>
            <div
            onClick={()=>navigate('leads', {state: {searchKey: 'Completed'}})}
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7 cursor-pointer"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Completed Leads
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {completedLeads}
                </span>
              </div>
            </div>
            <div
            onClick={()=>navigate('leads', {state: {searchKey: 'Cancelled'}})}
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white rounded-md text-center py-7 cursor-pointer"
            >
              <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
                Cancelled Leads
                <MdKeyboardArrowRight size={25} />
              </h1>
              <div className="mt-4 font-bold text-[#595959]">
                {/* This Month */}
                <span className="bg-[#ff6565] text-[#ffffff] rounded px-2 ml-1 py-1">
                  {cancelledLeads}
                </span>
              </div>
            </div>
          </div>

          {/* {categoryDropdown && (
            <div
              className="mt-2 bg-white rounded-md text-center py-7"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Categories
              </h1>

              <div>
                {categories.length === 0 && <p>No categories.</p>}
                {categories.length > 0 && <div className="py-3 px-10">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>S. No.</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                      </Tr>
                    </Thead>
                  {categories.map((category,ind)=> <Tr>
                    <Td>{ind+1}</Td>
                    <Td>{category.categoryname}</Td>
                    <Td>{category.description}</Td>
                  </Tr>)}
                  </Table>  
                </div>}
              </div>
            </div>
          )} */}

          {/* {productDropdown && (
            <div
              className="mt-2 bg-white rounded-md text-center py-7"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Stock List
              </h1>

              <div>
                {products.length === 0 && <p>No products.</p>}
                {products.length > 0 && <div className="py-3 px-10">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>S. No.</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                        <Th>Price</Th>
                        <Th>Stock</Th>
                        <Th>Category</Th>
                      </Tr>
                    </Thead>
                  {products.map((product,ind)=> <Tr>
                    <Td>{ind+1}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.description}</Td>
                    <Td>Rs {product.price}</Td>
                    <Td>{product.stock}</Td>
                    <Td>{product.category.categoryname}</Td>
                  </Tr>)}
                  </Table>  
                </div>}
              </div>
            </div>
          )} */}

          {/* {followupDropdown && (
            <div
              className="mt-2 bg-white rounded-md text-center py-7"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <h1 className="text-xl border-b font-bold pb-4 text-[#22075e]">
                Follow-ups
              </h1>

              <div>
                {followup.length === 0 && <p>No follow-up.</p>}
                {followup.length > 0 && <div className="py-3 px-10">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>S. No.</Th>
                        <Th>Created By</Th>
                        <Th>Created On</Th>
                        <Th>Lead</Th>
                        <Th>Follow-up Date</Th>
                        <Th>Follow-up Reason</Th>
                      </Tr>
                    </Thead>
                  {followup.map((lead,ind)=> <Tr>
                    <Td>{ind+1}</Td>
                    <Td>{lead.creator.name}</Td>
                    <Td>{moment(lead.createdAt).format('DD/MM/YYYY')}</Td>
                    <Td>{lead?.people ? (lead.people.firstname + ' ' + lead.people.lastname) : lead.company.companyname}</Td>
                    <Td>{moment(lead.followup_date).format('DD/MM/YYYY')}</Td>
                    <Td>{lead.followup_reason}</Td>
                  </Tr>)}
                  </Table>  
                </div>}
              </div>
            </div>
          )} */}

          <div className="flex flex-col md:flex-row mt-6">
            <div
              className="bg-white py-5 px-5 text-center rounded grid grid-cols-1 md:grid-cols-3 flex-1"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <div className="px-6">
                <h1 className="text-xl font-bold pb-4 text-[#22075e]">
                  Invoices
                </h1>
                <div>
                  {invoiceStatus.length === 0 && <Loading />}
                  {invoiceStatus.length > 0 &&
                    invoiceStatus.map((item, ind) => {
                      return (
                        <div key={ind} className="mb-5">
                          {(item.status === "Paid" ||
                            item.status === "Unpaid" ||
                            item.status === "Partially Paid") && (
                            <div className="text-[#595959] font-bold">
                              <div className="flex justify-between">
                                <span>{item.status}</span>
                                <span>
                                  {Math.floor(
                                    (item.count /
                                      (totalInvoicePaymentStatus === 0
                                        ? 1
                                        : totalInvoicePaymentStatus)) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="bg-[#0000000f] h-[10px] rounded-md">
                                <div
                                  style={{
                                    width: `${
                                      (item.count /
                                        (totalInvoicePaymentStatus === 0
                                          ? 1
                                          : totalInvoicePaymentStatus)) *
                                      100
                                    }%`,
                                    backgroundColor:
                                      progressStyles[item.status.toLowerCase()]
                                        .bg,
                                  }}
                                  className="h-[10px] rounded-md"
                                ></div>
                              </div>
                            </div>
                          )}

                          {item.status !== "Paid" &&
                            item.status !== "Unpaid" &&
                            item.status !== "Partially Paid" && (
                              <div className="text-[#595959] font-bold">
                                <div className="flex justify-between">
                                  <span>{item.status}</span>
                                  <span>
                                    {Math.floor(
                                      (item.count /
                                        (totalInvoiceStatus === 0
                                          ? 1
                                          : totalInvoiceStatus)) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="bg-[#0000000f] h-[10px] rounded-md">
                                  <div
                                    style={{
                                      width: `${
                                        (item.count /
                                          (totalInvoiceStatus === 0
                                            ? 1
                                            : totalInvoiceStatus)) *
                                        100
                                      }%`,
                                      backgroundColor:
                                        progressStyles[
                                          item.status.toLowerCase()
                                        ].bg,
                                    }}
                                    className="h-[10px] rounded-md"
                                  ></div>
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  ;
                </div>
              </div>

              <div className="px-6">
                <h1 className="text-xl font-bold pb-4 text-[#22075e]">
                  Proforma Invoices
                </h1>
                <div>
                  {proformaInvoiceStatus.length === 0 && <Loading />}
                  {proformaInvoiceStatus.length > 0 &&
                    proformaInvoiceStatus.map((item, ind) => {
                      return (
                        <div key={ind} className="mb-5">
                          <div className="text-[#595959] font-bold flex justify-between items-center">
                            <span>{item.status}</span>
                            <span>
                              {Math.floor(
                                (item.count /
                                  (totalProformaInvoice === 0
                                    ? 1
                                    : totalProformaInvoice)) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="bg-[#0000000f] h-[10px] rounded-md">
                            <div
                              style={{
                                width: `${
                                  (item.count /
                                    (totalProformaInvoice === 0
                                      ? 1
                                      : totalProformaInvoice)) *
                                  100
                                }%`,
                                backgroundColor:
                                  progressStyles[item.status.toLowerCase()].bg,
                              }}
                              className="h-[10px] rounded-md"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="px-6">
                <h1 className="text-xl font-bold pb-4 text-[#22075e]">
                  Offers
                </h1>
                <div>
                  {offerStatus.length === 0 && <Loading />}
                  {offerStatus.length > 0 &&
                    offerStatus.map((item, ind) => {
                      return (
                        <div key={ind} className="mb-5">
                          <div className="text-[#595959] font-bold flex justify-between items-center">
                            <span>{item.status}</span>
                            <span>
                              {Math.floor(
                                (item.count /
                                  (totalOffer === 0 ? 1 : totalOffer)) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="bg-[#0000000f] h-[10px] rounded-md">
                            <div
                              style={{
                                width: `${
                                  (item.count /
                                    (totalOffer === 0 ? 1 : totalOffer)) *
                                  100
                                }%`,
                                backgroundColor:
                                  progressStyles[item.status.toLowerCase()].bg,
                              }}
                              className="w-[67%] h-[10px] rounded-md"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
              className="bg-white w-full mt-2 ml-0 md:mt-0 md:w-fit px-2 md:ml-2 text-center py-5 rounded"
            >
              <h1 className="text-xl font-bold pb-4 text-[#22075e]">
                Total Customers
              </h1>

              <div className="w-[180px] h-[180px] m-auto rounded-full flex items-center justify-center border-[#41ad5e] border-l-[10px] border-r-[10px] border-t-[10px] border-b-white border-b-[10px]">
                <div className="bg-white rounded-full h-[90%] w-[90%] flex items-center justify-center text-3xl text-[#22075e] font-bold">
                  {totalCustomer}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
