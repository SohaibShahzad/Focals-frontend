import { useEffect, useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../../contexts/ContextProvider";
import { adminLinks } from "../../routes/adminRoutes";
import ActiveLink from "../../components/activeLink";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";

export const Sidebar = ({ role, userType }) => {
  const sidebarRef = useRef();
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSidebar = () => {
    const scrollTop = sidebarRef.current.scrollTop;
    sessionStorage.setItem("scrollY", scrollTop);
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleBackToSite = () => {
    router.push("/");
  };

  const handleLogout = async (setAuthenticated) => {
    try {
      await axios.delete(`/api/session`, { withCredentials: true });
      localStorage.removeItem("token");
      setAuthenticated(false);
      router.push("/admin");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  };

  let filteredAdminLinks = adminLinks;
  if (userType === "admin") {
    filteredAdminLinks = adminLinks;
  } else {
    filteredAdminLinks = adminLinks
      .filter((section) => section.title !== "Personnel")
      .map((section) => {
        if (section.title === "Dashboard") {
          return section;
        } else {
          return {
            ...section,
            links: section.links.filter((link) =>
              role.includes(link.name.toLowerCase())
            ),
          };
        }
      });
  }

  useEffect(() => {
    sidebarRef.current.scrollTop = sessionStorage.getItem("scrollY");
  }, []);

  const baseHref = userType === 'admin' ? "/admin/dashboard" : "/subadmin/dashboard"; // add this line

  return (
    <div
      ref={sidebarRef}
      className="fixed glassmorphism-sidebar text-white font-poppins md:overflow-y-auto overflow-x-hidden overflow-auto md:hover:overflow-x-hidden pb-10 rounded-lg"
      style={{ height: "calc(100vh - 20px)" }}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link href="/admin/dashboard">
              <div className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-slate-900">
                <div className="p-2">
                  <img src="/Logo.png" alt="FutureFocals" />
                </div>
                <div className="text-white">FutureFocals</div>
              </div>
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
            {filteredAdminLinks.map((link, index) => (
              <div key={index}>
                <p className="text-gray-400 m-3 mt-4 uppercase">{link.title}</p>
                {link.links.map((link, index) => (
                  <ActiveLink
                    key={index}
                    href={`${baseHref}${link.linkName.toLowerCase()}`}
                    styles="flex items-center gap-5 pl-4 py-3 rounded-lg text-lg text-white text-gray-700 hover:bg-[#d8730e] m-2"
                    onClick={handleCloseSidebar}
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </ActiveLink>
                ))}
              </div>
            ))}
            <div className="my-[20px] mx-[20px] rounded-md h-[2px] bg-white opacity-20" />

            <button
              className="flex items-center text-lg button-animation-reverse-orange-soft hover:scale-100 justify-center mx-3 text-center w-[91%] py-3 rounded-lg"
              onClick={handleBackToSite}
            >
              {"< "}Back to Site
            </button>
            <button
              className="m-3 text-center text-lg button-animation-reverse-orange-soft hover:scale-100 w-[91%] py-3 rounded-lg"
              onClick={() => {
                handleLogout(setAuthenticated);
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
