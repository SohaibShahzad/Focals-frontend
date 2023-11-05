import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import {
  RiShoppingCart2Line,
  RiNotificationLine,
  RiWechatLine,
} from "react-icons/ri";
import { parseCookies } from "nookies";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AdminCart } from "./admin-cart";
import { AdminChat } from "./admin-chat";
import { AdminNotify } from "./admin-notify";
import { AdminProfile } from "./admin-profile";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const NavButton = ({ title, customFunc, icon, color, badgeContent }) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    aria-label={title}
  >
    {badgeContent > 0 && (
      <span className="absolute flex justify-center items-center text-xs font-bold text-white bg-orange-600 rounded-full h-5 w-5 -top-[1px] -right-[1px]">
        {badgeContent}
      </span>
    )}
    {icon}
  </button>
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

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userId, setUserId] = useState(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      // If closing the notifications, fetch new ones
      fetchNotifications();
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    // Optimistically update the UI first
    const updatedNotifications = notifications.map((notification) =>
      notification._id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    setNotificationCount((prevCount) => prevCount - 1);

    try {
      // Then send the request to the server
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}notifications/read/${notificationId}`
      );
    } catch (error) {
      // If the request fails, rollback the optimistic update
      setNotifications(notifications); // Reset notifications to previous state
      setNotificationCount((prevCount) => prevCount + 1);
    }
  };

  const markAllNotificationsAsRead = async () => {
    // First, check if the userId state is set
    if (!userId) {
      console.error(
        "User ID is not available to mark all notifications as read."
      );
      return;
    }

    try {
      // Optimistically update the UI first
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      // Set the updated notifications and reset the notification count
      setNotifications(updatedNotifications);
      setNotificationCount(0);

      // Send the request to the server
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}notifications/readAll/${userId}`
      );

      // If you have any additional logic to handle after successfully marking all as read, you can place it here
    } catch (error) {
      // If the request fails, rollback the optimistic update
      console.error("Marking all notifications as read failed: ", error);
      // Here you would need to handle the rollback properly.
      // This could be done by keeping a separate state of unread notifications
      // Or by refetching the notifications from the server.
    }
  };

  const fetchNotifications = async () => {
    const cookies = parseCookies();
    const token = cookies.token;
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.type === "user" && decoded.id) {
        setUserId(decoded.id);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}notifications/getNotificationsByUser/${decoded.id}`
          );
          const unreadNotifications = response.data.filter(
            (notification) => !notification.isRead
          );
          setNotificationCount(unreadNotifications.length);
          setNotifications(response.data);
        } catch (error) {
          console.error("Fetching notifications failed: ", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // Fetch notifications every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  return (
    <>
      {showNotifications && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
          onClick={toggleNotifications}
        />
      )}
      <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
        <NavButton
          title="Menu"
          customFunc={() => setActiveMenu(!activeMenu)}
          color="orange"
          icon={<HiOutlineMenuAlt2 />}
        />
        <div className="flex">
          <NavButton
            title="Notifications"
            customFunc={toggleNotifications}
            color="orange"
            icon={<RiNotificationLine />}
            badgeContent={notificationCount}
          />
          {showNotifications && (
            <AdminNotify
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
            />
          )}
          {/* Uncomment below buttons and their corresponding components as needed */}
          {/* <NavButton
            title="Cart"
            customFunc={() => handleClick("cart")}
            color="blue"
            icon={<RiShoppingCart2Line />}
            badgeContent={5}
          />
          <NavButton
            title="Chat"
            customFunc={() => handleClick("chat")}
            color="blue"
            icon={<RiWechatLine />}
            badgeContent={3}
          />
          <NavButton
            title="Profile"
            customFunc={() => handleClick("profile")}
            color="blue"
            icon={<CgProfile />}
          />
          {isClicked.cart && <AdminCart />}
          {isClicked.chat && <AdminChat />}
          {isClicked.profile && <AdminProfile />} */}
          {/* <button
            type="button"
            className="text-xl rounded-full p-3 hover:bg-light-gray text-gray-700"
            aria-label="User Profile"
          >
            <CgProfile />
            <MdKeyboardArrowDown />
          </button> */}
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
