import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

const OffersDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchOfferDetails = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
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

      setDetails({
        offername: data.offer.offername,
        startdate: moment(data.offer.startdate).format("DD/MM/YYYY"),
        expiredate: moment(data.offer.expiredate).format("DD/MM/YYYY"),
        total: data.offer.total,
        subtotal: data.offer.subtotal,
        status: data.offer.status,
        phone: data.offer?.lead.people
          ? data.offer.lead.people.phone
          : data.offer?.lead.company.phone,
        email: data.offer?.lead.people
          ? data.offer.lead.people.email
          : data.offer?.lead.company.email,
        offertype:
          data.offer.lead.leadtype === "People" ? "Individual" : "Corporate",
        products: data.offer.products,
        remarks: data.offer.remarks,
        taxamount: data.offer?.tax[0].taxamount,
        taxname: data.offer?.tax[0].taxname,
        taxpercentage: data.offer?.tax[0].taxpercentage,
        createdByName: data.offer?.createdBy.name,
        createdByDesignation: data.offer?.createdBy.designation,
        createdByPhone: data.offer?.createdBy.phone,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOfferDetails(id);
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
        Offer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Offer Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Offer Type</p>
              <p className="font-normal">{details?.offertype}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Offer Name</p>
              <p className="font-normal">{details?.offername}</p>
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
              <p>Start Date</p>
              <p className="font-normal">{details?.startdate}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>End Date</p>
              <p className="font-normal">{details?.expiredate}</p>
            </div>
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

export default OffersDetailsDrawer;
