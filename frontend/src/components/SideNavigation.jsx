import { NavLink } from "react-router-dom";
import { MdMenu, MdClose, MdSupportAgent } from "react-icons/md";
import {
  MdOutlineSpeed,
  MdHeadphones,
  MdOutlinePeople,
  MdHomeWork,
  MdLeaderboard,
  MdLocalOffer,
  MdNewspaper,
  MdOutlinePayment,
  MdOutlineProductionQuantityLimits,
  MdOutlineCategory,
  MdAttachMoney,
} from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import { FaFileInvoice, FaFileLines, FaPeopleGroup } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { useSelector } from "react-redux";
import { IoSettingsSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const SideNavigation = ({isMenuOpen, setIsMenuOpen}) => {
  const { allowedroutes, role } = useSelector((state) => state.auth);

  return (
    <div className="px-3 py-3 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-auto bg-[#f9fafc] xl:relative">      
      {isMenuOpen && (
        <div
          className="flex justify-end mr-5 text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdClose />
        </div>
      )}
      <ul className="text-sm font-bold">
        {(role === 'Super Admin' || allowedroutes.includes("dashboard")) && (
          <NavLink
            end={true}
            to=""
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlineSpeed />
              </span>
              <span>Dashboard</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("admin")) && (
          <NavLink
            to="admins"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <FaPeopleGroup />
              </span>
              <span>Employees</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("people")) && (
          <NavLink
            to="individuals"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlinePeople />
              </span>
              <span>Individuals</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("company")) && (
          <NavLink
            to="corporates"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdHomeWork />
              </span>
              <span>Corporates</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("lead")) && (
          <NavLink
            to="leads"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdLeaderboard />
              </span>
              <span>Leads</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("lead")) && (
          <NavLink
            to="assigned-leads"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdLeaderboard />
              </span>
              <span>Assigned Leads</span>
            </li>
          </NavLink>
        )}
                {/* {(role === 'Super Admin' || allowedroutes.includes("lead")) && (
          <NavLink
            to="indiamart-leads"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdLeaderboard />
              </span>
              <span>Indiamart Leads</span>
            </li>
          </NavLink>
        )}  */}
        {(role === 'Super Admin' || allowedroutes.includes("customer")) && (
          <NavLink
            to="customers"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdHeadphones />
              </span>
              <span>Customers</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("user")) && (
          <NavLink
            to="users"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <FaUserFriends />
              </span>
              <span>Users</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("offer")) && (
          <NavLink
            to="offers"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdLocalOffer />
              </span>
              Offers
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("invoice")) && (
          <NavLink
            to="invoices"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <FaFileInvoice />
              </span>
              <span>Invoices</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("proforma-invoice")) && (
          <NavLink
            to="proforma-invoices"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <FaFileLines />
              </span>
              <span>Proforma Invoices</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("payment")) && (
          <NavLink
            to="payments"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlinePayment />
              </span>
              <span>Payments</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("product")) && (
          <NavLink
            to="products"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlineProductionQuantityLimits />
              </span>
              <span>Products</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("category")) && (
          <NavLink
            to="products-category"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlineCategory />
              </span>
              <span>Products Category</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("expense")) && (
          <NavLink
            to="expenses"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdAttachMoney />
              </span>
              <span>Expenses</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("expense-category")) && (
          <NavLink
            to="expenses-category"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdOutlineCategory />
              </span>
              <span>Expenses Category</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("report")) && (
          <NavLink
            to="report"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <TbReport />
              </span>
              <span>Report</span>
            </li>
          </NavLink>
        )}
        {/* {(role === 'Super Admin' || allowedroutes.includes("support")) && ( */}
        {role === 'Super Admin' && (
          <NavLink
            to="support"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdSupportAgent />
              </span>
              <span>Support</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("support")) && (
          <NavLink
            to="assigned-support"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <MdSupportAgent />
              </span>
              <span>Assigned Support</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("website-configuration")) && (
          <NavLink
            to="website-configuration"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <GrConfigure  />
              </span>
              <span>CRM Configuration</span>
            </li>
          </NavLink>
        )}
        {(role === 'Super Admin' || allowedroutes.includes("settings")) && (
          <NavLink
            to="settings"
            className={({ isActive }) =>
              isActive ? "text-[#1640d6]" : "text-black"
            }
            onClick={()=>{isMenuOpen && setIsMenuOpen(false)}}
          >
            <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] text-[15px]">
              <span>
                <IoSettingsSharp  />
              </span>
              <span>Settings</span>
            </li>
          </NavLink>
        )}
      </ul>
    </div>
  );
};

export default SideNavigation;
