import { Sidebar as AdminSidebar } from "../sections/adminPanelSections/sidebar";
import { Sidebar as UserSidebar } from "../sections/userPanelSections/sidebar";
import { useStateContext } from "../contexts/ContextProvider";
import { AdminNavbar } from "../sections/adminPanelSections/admin-navbar";

const DashboardLayout = ({ children, role, userType }) => {
  const { activeMenu } = useStateContext();

  const Sidebar = userType === "admin" ? AdminSidebar : UserSidebar;

  return (
    <div className="flex text-white min-h-screen bg-[#111111]">
      {activeMenu && (
        <div className="w-72 fixed z-[1000] bg-black rounded-lg h-full m-2">
          <Sidebar role={role} userType={userType}/>
        </div>
      )}
      <div
        className={`bg-main-bg ${
          activeMenu ? "md:ml-72" : ""
        } w-full min-h-screen flex flex-col`}
      >
        <div className="static bg-main-bg navbar w-full">
          <AdminNavbar />
        </div>
        <div className="flex-grow mx-[2.5rem]">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
