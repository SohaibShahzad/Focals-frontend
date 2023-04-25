// import { ThemeSettings } from "../../components/themeSettings";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect } from "react";
import Link from "next/link";
// import AdminOverview from "@/sections/adminPanelSections/admin-overview";
import Overview from "../../pages/admin/dashboard/overview";

export const AdminDashboard = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div>
        {/* {themeSettings && <ThemeSettings />} */}
        <Overview />
      </div>
    </div>
  );
};
