import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

const ProformaInvoicesDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchProformaInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "proforma-invoice/proforma-invoice-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          proformaInvoiceId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        proformainvoicename: data.proformaInvoice.offername,
        startdate: moment(data.proformaInvoice.startdate).format("DD/MM/YYYY"),
        // expiredate: moment(data.proformaInvoice.expiredate).format("DD/MM/YYYY"),
        total: data.proformaInvoice.total,
        subtotal: data.proformaInvoice.subtotal,
        status: data.proformaInvoice.status,
        phone: data.proformaInvoice?.people
          ? data.proformaInvoice.people.phone
          : data.proformaInvoice?.company.phone,
        email: data.proformaInvoice?.people
          ? data.proformaInvoice.people.email
          : data.proformaInvoice?.company.email,
        customertype:
          data.proformaInvoice?.people ? "Individual" : "Corporate",
        customer:
          data.proformaInvoice?.people ? (data.proformaInvoice?.people.firstname + ' ' + data.proformaInvoice?.people.lastname) : data.proformaInvoice?.company.companyname,
        products: data.proformaInvoice.products,
        remarks: data.proformaInvoice.remarks,
        taxamount: data.proformaInvoice?.tax[0].taxamount,
        taxname: data.proformaInvoice?.tax[0].taxname,
        taxpercentage: data.proformaInvoice?.tax[0].taxpercentage,
        createdByName: data.proformaInvoice?.createdBy.name,
        createdByDesignation: data.proformaInvoice?.createdBy.designation,
        createdByPhone: data.proformaInvoice?.createdBy.phone,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProformaInvoiceDetails(id);
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
        Proforma Invoice
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Proforma Invoice Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Customer Type</p>
              <p className="font-normal">{details?.customertype}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Created By (Name)</p>
              <p className="font-normal">{details?.createdByName}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Created By (Designation)</p>
              <p className="font-normal">{details?.createdByDesignation}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Created By (Phone)</p>
              <p className="font-normal">{details?.createdByPhone}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Customer</p>
              <p className="font-normal">{details?.customer}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Start Date</p>
              <p className="font-normal">{details?.startdate}</p>
            </div>
            {/* <div className="mt-3 mb-5 font-bold">
              <p>End Date</p>
              <p className="font-normal">{details?.expiredate}</p>
            </div> */}
            <div className="mt-3 mb-5 font-bold">
              <p>Status</p>
              <p className="font-normal">{details?.status}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Sub Total</p>
              <p className="font-normal">&#8377;{details?.subtotal}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Tax</p>
              <p className="font-normal">{details?.taxname}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Tax Percentage</p>
              <p className="font-normal">{details?.taxpercentage === 1 ? 0 : details?.taxpercentage * 100}%</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Tax Amount</p>
              <p className="font-normal">&#8377;{details?.taxamount}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Total</p>
              <p className="font-normal">&#8377;{details?.total}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Phone</p>
              <p className="font-normal">
                {details?.phone ? details.phone : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Email</p>
              <p className="font-normal">
                {details?.email ? details.email : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 cursor-pointer">
              <p className="font-bold mb-1">Products Interested In</p>
              <div>
                <table className="border w-full border-collapse text-left">
                  <tr className="border border-collapse">
                    <th className="border border-collapse px-1 py-1">
                      Product
                    </th>
                    <th className="border border-collapse px-1 py-1">
                      Category
                    </th>
                    <th className="border border-collapse px-1 py-1">Image</th>
                  </tr>
                  {details?.products?.map((p, ind) => {
                    return (
                      <tr className="border border-collapse" key={p._id}>
                        <td
                          className="border border-collapse px-1 py-1"
                          px-1
                          py-1
                        >
                          {p.product.name}
                        </td>
                        <td className="border border-collapse px-1 py-1">
                          {p.product.category.categoryname}
                        </td>
                        <td className="border border-collapse px-1 py-1">
                          <Avatar size="sm" src={p.product.imageUrl} />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Remarks</p>
              <p className="font-normal">
                {details?.remarks ? details.remarks : "Not Available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProformaInvoicesDetailsDrawer;
