import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";
import moment from 'moment';

const LeadsDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchLeadDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "lead/lead-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          leadId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        name: data.lead.name,
        type: data.lead.leadtype,
        company: data.lead?.company ? data.lead?.company?.companyname : "",
        people: data.lead?.people
          ? data.lead?.people?.firstname + " " + data.lead?.people?.lastname
          : "",
        status: data.lead.status,
        source: data.lead.source,
        phone: data.lead?.company
          ? data.lead.company.phone
          : data.lead.people.phone,
        email: data.lead?.company
          ? data.lead.company.email
          : data.lead.people.email,
        notes: data.lead?.notes ? data.lead.notes : "",
        products: data.lead?.products,
        assignedName: data.lead?.assigned?.name || "N/A",
        assignedPhone: data.lead?.assigned?.phone || "N/A",
        assignedEmail: data.lead?.assigned?.email || "N/A",
        followupDate: data.lead?.followup_date,
        followupReason: data.lead?.followup_reason
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeadDetails(id);
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
        Lead
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Lead Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Type</p>
              <p className="font-normal">
                {details?.type ? details.type : "Not Available"}
              </p>
            </div>
            {details.company && (
              <div className="mt-3 mb-5 font-bold">
                <p>Corporate</p>
                <p className="font-normal">{details?.company}</p>
              </div>
            )}
            {details.people && (
              <div className="mt-3 mb-5 font-bold">
                <p>Individual</p>
                <p className="font-normal">{details?.people}</p>
              </div>
            )}
            {/* <div className="mt-3 mb-5 font-bold">
              <p>Name</p>
              <p className="font-normal">{details?.name ? details.name : 'Not Available'}</p>
            </div> */}
            <div className="mt-3 mb-5 font-bold">
              <p>Status</p>
              <p className="font-normal">
                {details?.status ? details.status : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Source</p>
              <p className="font-normal">
                {details?.source ? details.source : "Not Available"}
              </p>
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
                  {details?.products.map((p, ind) => {
                    return (
                      <tr className="border border-collapse" key={p._id}>
                        <td
                          className="border border-collapse px-1 py-1"
                          px-1
                          py-1
                        >
                          {p.name}
                        </td>
                        <td className="border border-collapse px-1 py-1">
                          {p.category.categoryname}
                        </td>
                        <td className="border border-collapse px-1 py-1">
                          <Avatar size="sm" src={p.imageUrl} />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
            {details?.followupDate && <div className="mt-3 mb-5 font-bold">
              <p>Follow-up Date</p>
              <p className="font-normal">
                {moment(details.followupDate).format('DD-MM-YYYY')}
              </p>
            </div>}
            {details?.followupReason && <div className="mt-3 mb-5 font-bold">
              <p>Follow-up Reason</p>
              <p className="font-normal">
                {details?.followupReason}
              </p>
            </div>}
            <div className="mt-3 mb-5 font-bold">
              <p>Remarks</p>
              <p className="font-normal">
                {details?.notes ? details.notes : "Not Available"}
              </p>
            </div>
            {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
              <p>Assigned To (Name)</p>
              {<p className="font-normal">{details?.assignedName}</p>}
            </div>}
            {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
              <p>Assigned To (Phone)</p>
              <p className="font-normal">{details?.assignedPhone}</p>
            </div>}
            {details?.assignedName !== "N/A" && <div className="mt-3 mb-5 font-bold">
              <p>Assigned To (Email)</p>
              <p className="font-normal">{details?.assignedEmail}</p>
            </div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsDetailsDrawer;
