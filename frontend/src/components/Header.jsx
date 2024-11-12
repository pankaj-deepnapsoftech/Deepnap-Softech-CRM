import { Avatar } from "@chakra-ui/react";
import logo from "../assets/images/logo/logo.png";
import { useContext, useEffect, useState } from "react";
import UserDetailsMenu from "./ui/Modals/UserDetailsMenu";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import ClickMenu from "./ui/ClickMenu";
import { IoIosNotifications } from "react-icons/io";
import Loading from "./ui/Loading";
import {
  closeAddLeadsDrawer,
  closeNotificationsShowDetailsLeadsDrawer,
  closeShowDetailsLeadsDrawer,
  openNotificationsShowDetailsLeadsDrawer,
  openShowDetailsLeadsDrawer,
} from "../redux/reducers/misc";
import LeadsDetailsDrawer from "./ui/Drawers/Details Drawers/LeadsDetailsDrawer";
import LeadsDrawer from "./ui/Drawers/Add Drawers/LeadsDrawer";
import { notificationContext } from "./ctx/notificationContext";
import { SocketContext } from "../socket";

const Header = () => {
  const [showUserDetailsMenu, setShowUserDetailsMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies();
  const user = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [dataId, setDataId] = useState();

  const notificationCtx = useContext(notificationContext);
  const socket = useContext(SocketContext);

  const { showNotificationsDetailsLeadsDrawerIsOpened } = useSelector(
    (state) => state.misc
  );

  const toggleUserDetailsMenu = () => {
    setShowUserDetailsMenu((prev) => !prev);
  };

  const toggleNotificationsMenu = () => {
    setShowNotificationsMenu((prev) => !prev);
  };

  const logoutHandler = () => {
    if (cookies.access_token !== undefined) {
      removeCookie("access_token");
    }
    dispatch(userNotExists());
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    notificationCtx.getNotifications();
  }, []);

  useEffect(() => {
    socket.on("NEW_SUPPORT_QUERY", (data) => {
      toast.info(data);
      notificationCtx.getUnseenNotificationsHandler();
    });
    socket.on("SUPPORT_QUERY_ASSIGNED", (data) => {
      toast.info(data);
      notificationCtx.getUnseenNotificationsHandler();
    });
    socket.on("NEW_FOLLOWUP_LEAD", (data) => {
      toast.info(data);
      notificationCtx.getUnseenNotificationsHandler();
    });
    socket.on("NEW_ASSIGNED_LEAD", (data) => {
      toast.info(data);
      notificationCtx.getUnseenNotificationsHandler();
    });

    return () => {
      socket.off("NEW_SUPPORT_QUERY", (data) => {
        toast.info(data);
        notificationCtx.getUnseenNotificationsHandler();
      });
      socket.off("SUPPORT_QUERY_ASSIGNED", (data) => {
        toast.info(data);
        notificationCtx.getUnseenNotificationsHandler();
      });
      socket.off("NEW_FOLLOWUP_LEAD", (data) => {
        toast.info(data);
        notificationCtx.getUnseenNotificationsHandler();
      });
      socket.off("NEW_ASSIGNED_LEAD", (data) => {
        toast.info(data);
        notificationCtx.getUnseenNotificationsHandler();
      });
    };
  }, []);

  useEffect(() => {
    if (showNotificationsMenu) {
      notificationCtx.seenNotificationHandler();
    }
  }, [showNotificationsMenu]);

  return (
    <div className="relative flex justify-between items-center py-2 px-3">
      {showNotificationsDetailsLeadsDrawerIsOpened && (
        <ClickMenu
          top={0}
          right={0}
          closeContextMenuHandler={() =>
            dispatch(closeNotificationsShowDetailsLeadsDrawer())
          }
        >
          {dataId && (
            <LeadsDetailsDrawer
              dataId={dataId}
              closeDrawerHandler={() =>
                dispatch(closeNotificationsShowDetailsLeadsDrawer())
              }
            />
          )}
        </ClickMenu>
      )}
      <img src={logo} className="w-[150px]"></img>

      <div className="flex gap-x-5 items-center">
        <div className="relative">
          {notificationCtx.unseenNotifications > 0 && (
            <span className="absolute top-[-10px] left-[18px] bg-red-600 text-white h-[25px] w-[25px] rounded-full flex items-center justify-center">
              {notificationCtx.unseenNotifications}
            </span>
          )}
          <IoIosNotifications
            size={40}
            onClick={() => {
              notificationCtx.getNotifications();
              toggleNotificationsMenu();
            }}
          />
        </div>
        {showNotificationsMenu && (
          <ClickMenu
            top={70}
            right={28}
            closeContextMenuHandler={() => setShowNotificationsMenu(false)}
          >
            <div
              className="overflow-auto relative bg-white px-6 py-6 z-30 rounded-lg w-[25rem] h-[20rem]"
              style={{
                boxShadow:
                  "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h1 className="text-2xl mb-2">Notifications</h1>
              {notificationContext.isLoading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loading />
                </div>
              )}
              {!notificationCtx.isLoading &&
                notificationCtx.notifications?.length === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    No Notifications.
                  </div>
                )}
              {!notificationCtx.isLoading &&
                notificationCtx.notifications?.length > 0 && (
                  <div className="overflow-auto">
                    {notificationCtx.notifications.map((notification, ind) => (
                      <div
                        // onClick={() => {
                        //   setDataId(notification.lead);
                        //   setShowNotificationsMenu(false);
                        //   dispatch(openNotificationsShowDetailsLeadsDrawer());
                        // }}
                        className="cursor-pointer text-lg border-b pb-1 mt-2"
                        key={ind}
                      >
                        {notification.message}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </ClickMenu>
        )}

        <Avatar
          cursor="pointer"
          size="md"
          name={user.name ? user.name : ""}
          onClick={toggleUserDetailsMenu}
        />
        {showUserDetailsMenu && (
          <ClickMenu
            top={70}
            right={0}
            closeContextMenuHandler={() => setShowUserDetailsMenu(false)}
          >
            <UserDetailsMenu
              name={user?.name}
              email={user?.email}
              role={user?.role}
              logoutHandler={logoutHandler}
              closeUserDetailsMenu={toggleUserDetailsMenu}
            />
          </ClickMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
