import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";

const UserDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchUserDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_CRM_BACKEND_URL;
      const response = await fetch(baseUrl + "user/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        name: data.user?.name,
        email: data.user?.email,
        phone: data.user?.phone,
        type: data.user?.account?.account_name,
        status: data.user?.account?.account_status,
        company: data.user?.company,
        employeeCount: data.user?.employeeCount,
        city: data.user?.city,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
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
        User
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          User Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Account Type</p>
              <p className="font-normal">{details?.type}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Name</p>
              <p className="font-normal">
                {details?.name ? details.name : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Email</p>
              <p className="font-normal">
                {details?.email ? details.email : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Phone</p>
              <p className="font-normal">
                {details?.phone ? details.phone : "Not Available"}
              </p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Status</p>
              <p className="font-normal">{details?.status}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Company Name</p>
              <p className="font-normal">{details?.company}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>City</p>
              <p className="font-normal">{details?.city}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>No. of Employees</p>
              <p className="font-normal">{details?.employeeCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsDrawer;
