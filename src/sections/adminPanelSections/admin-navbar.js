import { useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import {
  RiShoppingCart2Line,
  RiNotificationLine,
  RiWechatLine,
} from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AdminCart } from "./admin-cart";
import { AdminChat } from "./admin-chat";
import { AdminNotify } from "./admin-notify";
import { AdminProfile } from "./admin-profile";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  // <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-gray-300"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
        {icon}

    </button>
  // </TooltipComponent>
);

export const AdminNavbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if(screenSize <= 900){
        setActiveMenu(false);
    } else {
        setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mx-6 relative">
      <NavButton
        title="Toggle Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        icon={<HiOutlineMenuAlt2 />}
        color="orange"
        dotColor="bg-gray-500"
      />
      <div className="flex">
        {/* <NavButton
          title="Cart"
          customFunc={() => handleClick("cart")}
          icon={<RiShoppingCart2Line />}
          color="orange"
          // dotColor="bg-gray-500"
        />
        <NavButton
          title="Chat"
          customFunc={() => handleClick("chat")}
          icon={<RiWechatLine />}
          color="orange"
          dotColor="#03C9D7"
        />
        <NavButton
          title="Notifications"
          customFunc={() => handleClick("notification")}
          icon={<RiNotificationLine />}
          color="orange"
          dotColor="#03C9D7"
        /> */}
        {/* <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-lgray-300"
            onClick={() => handleClick("userProfile")}
          >
            <CgProfile className="rounded-full w-8 h-8 text-orange-400" />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                Admin
              </span>
            </p> */}
            {/* <MdKeyboardArrowDown className="text-gray-400 text-14" /> */}
          {/* </div>
        </TooltipComponent> */}

        {isClicked.cart && <AdminCart />}
        {isClicked.chat && <AdminChat />}
        {isClicked.notification && <AdminNotify />}
        {isClicked.userProfile && <AdminProfile />}
      </div>
    </div>
  );
};
