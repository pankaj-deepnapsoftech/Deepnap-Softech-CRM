import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import AddDynamicItemFields from "../../AddDynamicItemFields";
import Loading from "../../Loading";

const OffersEditDrawer = ({ closeDrawerHandler, getAllOffers, dataId: id }) => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [allLeads, setAllLeads] = useState();
  const [selectedLead, setSelectedLead] = useState();
  const [leadOptionsList, setLeadOptionsList] = useState();

  const [year, setYear] = useState();
  const [yearOptionsList, setYearOptionsList] = useState();

  const [remarks, setRemarks] = useState("");

  const statusOptionsList = [
    { value: "Draft", label: "Draft" },
    { value: "Pending", label: "Pending" },
    { value: "Sent", label: "Sent" },
    { value: "Accepted", label: "Accepted" },
    { value: "Declined", label: "Declined" },
  ];
  const [selectedStatus, setSelectedStatus] = useState();

  const [offerId, setOfferId] = useState();
  const [date, setDate] = useState(new Date().toISOString().substring(0,10));
  const [expiryDate, setExpiryDate] = useState();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [items, setItems] = useState([
    { item: "", quantity: 0, price: 0, total: 0 },
  ]);

  const taxOptionsList = [
    { value: 1, label: "No tax 0%" },
    { value: 0.18, label: "GST 18%" },
  ];

  const [taxes, setTaxes] = useState([
    // {value: 1, label: ''}
  ]);

  const getAllLeads = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(baseUrl + "lead/all-leads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setAllLeads(data.leads);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const editOfferHandler = async (e) => {
    e.preventDefault();

    const products = items.map((prod) => {
      return {
        product: prod.item,
        quantity: parseInt(prod.quantity),
        price: parseInt(prod.price),
        total: parseInt(prod.total),
      };
    });
    const tax = {
      taxname: taxes?.label,
      taxamount: taxes?.value === 1 ? 0 : subTotal * taxes?.value,
      taxpercentage: taxes?.value,
    };

    try {
      setUpdating(true);
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "offer/edit-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId,
          lead: selectedLead?.value,
          startdate: date,
          expiredate: expiryDate,
          status: selectedStatus?.value,
          remarks,
          products,
          subtotal: subTotal,
          total: total,
          tax
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      getAllOffers();
      closeDrawerHandler();
    } catch (err) {
      toast.error(err.message);
    } finally{
      setUpdating(false);
    }
  };

  const getOfferDetails = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      setIsLoading(true);
      const response = await fetch(baseUrl + "offer/offer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          offerId: id,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setOfferId(data.offer._id);
      setSelectedLead({
        value: data.offer.lead._id,
        label:
          data.offer.lead.leadtype === "People" ? "Individual" : "Corporate",
      });
      setSelectedStatus({ value: data.offer.status, label: data.offer.status });
      setDate(new Date(data.offer.startdate).toISOString().substring(0, 10));
      setExpiryDate(
        new Date(data.offer.expiredate).toISOString().substring(0, 10)
      );
      setRemarks(data.offer.remarks);
      setSubTotal(data.offer.subtotal);
      setTotal(data.offer.total);
      setTaxes({
        value: data.offer.tax[0].taxpercentage,
        label: data.offer.tax[0].taxname,
      });

      const products = data.offer.products.map((prod) => {
        return { value: prod.product._id, label: prod.product.name };
      });
      const items = data.offer.products.map((prod) => {
        return {
          item: prod.product._id,
          quantity: prod.quantity,
          price: prod.price,
          total: prod.total,
        };
      });
      setItems(items);
      setSelectedProducts(products);
    } catch (err) {
      toast.error(err.message);
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllLeads();
    getOfferDetails();
  }, []);

  useEffect(() => {
    let options = [{ value: "Add Lead", label: "+ Add Lead" }];
    options = options.concat(
      allLeads?.map((lead) => {
        return { value: lead._id, label: lead.name };
      })
    );
    setLeadOptionsList(options);
  }, [allLeads]);

  useEffect(() => {
    const subTotalAmt = items.reduce((acc, curr) => acc + curr.total, 0);
    setSubTotal(subTotalAmt);
  }, [items]);

  useEffect(() => {
    if (taxes?.value === 1) {
      setTotal(subTotal);
    } else {
      const total = subTotal * taxes?.value + subTotal;
      setTotal(total);
    }
  }, [taxes, subTotal]);

  return (
    <div
      className="overflow-auto overflow-auto h-[100vh] w-[90vw] md:w-[550px] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Offer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Edit Offer
        </h2>

        {isLoading && <Loading />}
        {!isLoading && <form onSubmit={editOfferHandler}>
          <div className="mt-2 mb-5">
            <label className="font-bold">Lead</label>
            <Select
              isRequired={true}
              className="rounded mt-2"
              options={leadOptionsList}
              placeholder="Select lead"
              value={selectedLead}
              onChange={(d) => {
                if (d.value === "Add Lead") {
                  closeDrawerHandler();
                  navigate("/crm/leads");
                }
                setSelectedLead(d);
              }}
              isSearchable={true}
            />
          </div>
          {/* <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Year</FormLabel>
            <Input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              type="date"
              placeholder="Year"
            />
          </FormControl> */}
          <div className="mt-2 mb-5">
            <label className="font-bold">Status</label>
            <Select
              className="rounded mt-2"
              options={statusOptionsList}
              placeholder="Select status"
              value={selectedStatus}
              onChange={(d) => {
                setSelectedStatus(d);
              }}
              isSearchable={true}
            />
          </div>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Date</FormLabel>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              placeholder="Date"
              min={new Date().toISOString().substring(0,10)}
            />
          </FormControl>
          <FormControl className="mt-3 mb-5" isRequired>
            <FormLabel fontWeight="bold">Expiry Date</FormLabel>
            <Input
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              type="date"
              placeholder="Expiry date"
              min={date}
            />
          </FormControl>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Remarks</FormLabel>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              type="text"
              placeholder="Remarks"
            />
          </FormControl>
          <AddDynamicItemFields
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            closeDrawerHandler={closeDrawerHandler}
            inputs={items}
            setInputs={setItems}
          />
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Sub Total</FormLabel>
            <Input
              value={subTotal}
              isDisabled={true}
              type="number"
              placeholder="Sub total"
            />
          </FormControl>
          <div className="mt-2 mb-5">
            <label className="font-bold">Tax</label>
            <Select
              className="rounded mt-2"
              options={taxOptionsList}
              placeholder="Select tax"
              value={taxes}
              onChange={(d) => {
                setTaxes(d);
              }}
              isSearchable={true}
            />
          </div>
          <FormControl className="mt-3 mb-5">
            <FormLabel fontWeight="bold">Total</FormLabel>
            <Input
              value={total}
              isDisabled={true}
              type="number"
              placeholder="Total"
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

export default OffersEditDrawer;
