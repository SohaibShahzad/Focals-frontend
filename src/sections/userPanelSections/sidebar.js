import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../../contexts/ContextProvider";
import { userDashLinks } from "../../routes/userDashRoutes";
import ActiveLink from "../../components/activeLink";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/auth";

export const Sidebar = () => {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleLogout = async (setAuthenticated) => {
    try {
      await axios.delete(`/api/session`, { withCredentials: true });
      localStorage.removeItem("token");
      setAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  };

  const handleBackToSite = () => {
    router.push("/");
  };

  return (
    <div className="glassmorphism-sidebar text-white font-poppins md:overflow-y-auto overflow-x-hidden overflow-auto md:hover:overflow-x-hidden pb-10 rounded-lg"  style={{height: "calc(100vh - 20px)"}}>
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
              <div className="text-white">FutureFocals</div>
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
            {userDashLinks.map((link, index) => (
              <div key={index}>
                <p className="text-gray-400 m-3 mt-4 uppercase">{link.title}</p>
                {link.links.map((link, index) => (
                  <ActiveLink
                    onClick={handleCloseSidebar}
                    href={`/dashboard${link.linkName.toLowerCase()}`}
                    styles="flex items-center gap-5 pl-4 py-3 rounded-lg text-lg text-white text-gray-700 hover:bg-[#d8730e] m-2"
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
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
