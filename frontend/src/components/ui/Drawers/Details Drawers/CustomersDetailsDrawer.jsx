import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { useCookies } from "react-cookie";
import { Avatar } from "@chakra-ui/react";

const CustomersDetailsDrawer = ({ dataId: id, closeDrawerHandler }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});

  const fetchCustomerDetails = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(baseUrl + "customer/customer-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({
          customerId: id,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setDetails({
        name: data.customer?.name,
        email: data.customer?.email,
        phone: data.customer?.phone,
        type: data.customer?.customertype,
        status: data.customer?.status,
        products: data.customer?.products,
      });

      setIsLoading(false);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
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
        Customer
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
          Customer Details
        </h2>

        {isLoading && <Loading />}
        {!isLoading && (
          <div>
            <div className="mt-3 mb-5 font-bold">
              <p>Type</p>
              <p className="font-normal">
                {details?.type
                  ? details.type === "People"
                    ? "Individual"
                    : "Corporate"
                  : "Not Available"}
              </p>
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
              <p className="font-normal">
                {details?.status ? details.status : "Not Available"}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersDetailsDrawer;
