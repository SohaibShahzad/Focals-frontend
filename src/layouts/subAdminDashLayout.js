import { Sidebar } from "../sections/adminPanelSections/sidebar";
import { useStateContext } from "../contexts/ContextProvider";
import { AdminNavbar } from "../sections/adminPanelSections/admin-navbar";

const SubAdminLayout = ({ children, role }) => {
  const { activeMenu } = useStateContext();
  return (
    <div className="flex text-white min-h-screen bg-[#111111]">
      {activeMenu ? (
        <div
          className="w-72 fixed z-[1000] bg-black rounded-lg h-full m-2"
          style={{ height: "calc(100vh - 20px)" }}
        >
          <Sidebar role={role}/>
        </div>
      ) : (
        <div className="w-0 h-full">
          <Sidebar role={role}/>
        </div>
      )}
      <div
        className={
          activeMenu
            ? " bg-main-bg flex flex-col w-full md:ml-72"
            : "bg-main-bg  w-full min-h-screen flex-2 flex flex-col"
        }
      >
        <div className="static bg-main-bg  navbar w-full">
          <AdminNavbar />
        </div>
        <div className="flex-grow mx-[2.5rem]">{children}</div>
      </div>
    </div>
  );
};

export default SubAdminLayout;
