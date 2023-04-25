import { Sidebar } from "../sections/userPanelSections/sidebar";
import { useStateContext } from "../contexts/ContextProvider";

import { AdminNavbar } from "../sections/adminPanelSections/admin-navbar";
const ClientLayout = ({ children }) => {
  const { activeMenu } = useStateContext();
  return (
    <div className="flex relative">
      {activeMenu ? (
        <div className="w-72 fixed sidebar-dashboard  bg-gray-100 ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 ">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
            : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2"
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <AdminNavbar />
        </div>
        <div className="mx-[5rem]">

        {children}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
