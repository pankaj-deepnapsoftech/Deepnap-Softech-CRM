import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";

const AdminDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchAdminDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "admin/admin-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          adminId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      setDetails({
        name: data.admin?.name,
        allowedroutes: data.admin?.allowedroutes,
        phone: data.admin?.phone,
        email: data.admin?.email,
        verified: data.admin?.verified,
        designation: data.admin?.designation,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
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
        Employee
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Employee Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Name</p>
              <p className="font-normal">{details?.name}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Verified</p>
              <p className="font-normal">{details?.verified ? 'Verified' : 'Not Verified'}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Designation</p>
              <p className="font-normal">{details?.designation}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Phone</p>
              <p className="font-normal">{details?.phone}</p>
            </div>
            <div className="mt-3 mb-5 font-bold">
              <p>Email</p>
              <p className="font-normal">{details?.email}</p>
            </div>
            <div className="mt-3 mb-5">
              <p className="font-bold">Permissions</p>
              {details.allowedroutes.length === 0 && (
                <span>No permission granted.</span>
              )}
              <ul className="list-decimal pl-4">
                {details.allowedroutes.map((r) => {
                  return <li>{r}</li>;
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDetailsDrawer;
