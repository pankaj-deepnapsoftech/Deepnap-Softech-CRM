import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import {
  FaBuilding,
  FaFileImage,
  FaFilePdf,
  FaMoneyCheck,
} from "react-icons/fa";

const Settings = () => {
  const { allowedroutes, role } = useSelector((state) => state.auth);

  return (
    <>
      {role !== "Super Admin" && !allowedroutes.includes("lead") && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ff6f6f]">
          You do not have access to this route. Contact your Super Admin for
          further action.
        </div>
      )}

      {(role === "Super Admin" || allowedroutes.includes("report")) && (
        <div>
          <div className="flex flex-col-reverse md:flex-row gap-2">
            <div
              className="flex-1 border-[1px] px-5 py-8 md:px-9 rounded"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <Outlet />
            </div>
            <div
              className="flex gap-2 flex-col border rounded px-2 py-1 border-[1px] px-5 py-8 md:px-9 rounded"
              style={{ boxShadow: "0 0 20px 3px #96beee26" }}
            >
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 mb-2">
                Settings
              </div>

              <NavLink
                end={true}
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to=""
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <IoSettingsSharp />
                  Account Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="company-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaBuilding />
                  Company Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="company-logo"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaFileImage />
                  Company Logo
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="pdf-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaFilePdf />
                  PDF Settings
                </li>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-[#1640d6]" : "text-black"
                }
                to="finance-settings"
              >
                <li className="font-bold flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
                  <FaMoneyCheck />
                  Finance Settings
                </li>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
