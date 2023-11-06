import { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../../contexts/ContextProvider";
import { userDashLinks } from "../../routes/userDashRoutes";
import ActiveLink from "../../components/activeLink";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";
import { parseCookies } from "nookies";

import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

export const Sidebar = () => {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const cookies = parseCookies();
      const token = cookies.token;
      if (token) {
        const decoded = jwt_decode(token);
        if (decoded.type === "user" && decoded.id) {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URL}notifications/getNotificationsByUser/${decoded.id}`
            );
            const notifications = response.data;
            // Check for at least one notification that is not read
            const hasUnread = notifications.some(
              (notification) => !notification.isRead
            );
            setHasUnreadNotifications(hasUnread);
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
        }
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000); // Fetch notifications every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`/api/session`, { withCredentials: true });
      localStorage.removeItem("token");
      setAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  };

  const handleBackToSite = () => {
    router.push("/");
  };

  return (
    <div
      className="glassmorphism-sidebar text-white font-poppins md:overflow-y-auto overflow-x-hidden overflow-auto md:hover:overflow-x-hidden pb-10 rounded-lg"
      style={{ height: "calc(100vh - 20px)" }}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              href="/dashboard"
              onClick={handleCloseSidebar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-slate-900"
            >
              <div className="p-2">
                <img src="/Logo.png" alt="FutureFocals" />
              </div>
              <span className="text-white">FutureFocals</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="mt-10">
            {userDashLinks.map((linkGroup, index) => (
              <div key={index}>
                <p className="text-gray-400 m-3 mt-4 uppercase">
                  {linkGroup.title}
                </p>
                {linkGroup.links.map((link, linkIndex) => (
                  <ActiveLink
                    key={linkIndex}
                    onClick={handleCloseSidebar}
                    href={`/dashboard${link.linkName.toLowerCase()}`}
                    styles={`flex items-center gap-5 pl-4 py-3 rounded-lg text-lg text-white text-gray-700 hover:bg-[#d8730e] m-2 ${
                      hasUnreadNotifications && link.name === "Projects" // Make sure this is the correct name
                        ? "relative"
                        : ""
                    }`}
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                    {hasUnreadNotifications &&
                      link.name === "Projects" && ( // Again, adjust if necessary
                        <span className="absolute right-0 mr-6 inline-block h-4 w-4 rounded-full bg-orange-600"></span>
                      )}
                  </ActiveLink>
                ))}
              </div>
            ))}
            <div className="my-[20px] mx-[20px] rounded-md h-[2px] bg-white opacity-20" />

            <button
              className="flex items-center text-lg text-black justify-center mx-3 text-center bg-[#f3993f] w-[91%] py-3 rounded-lg hover:bg-[#d8730e] hover:text-white"
              onClick={handleBackToSite}
            >
              {"< "}Back to Site
            </button>
            <button
              className="m-3 text-center text-lg text-black bg-[#f3993f] w-[91%] py-3 rounded-lg hover:bg-[#d8730e] hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
