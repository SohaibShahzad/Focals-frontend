import React, { createContext, useContext, useState, useEffect } from "react";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import io from "socket.io-client";

const jwt_decode = jwt.decode;

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

const ContextProvider = ({ children }) => {
  const cookies = parseCookies();
  const token = cookies.token;
  let userId;
  if (token) {
    const decodedToken = jwt_decode(token);
    userId = decodedToken?.id;
  }

  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const cartKey = userId ? `${userId}_cart` : "guest_cart";

    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(cartKey);
      setCart(localData ? JSON.parse(localData) : []);
    }
  }, [userId]);

  useEffect(() => {
    const cartKey = userId ? `${userId}_cart` : "guest_cart";
    if (userId) {
      localStorage.removeItem("guest_cart");
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, userId]);

  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [unreadProjectMessages, setUnreadProjectMessages] = useState({});

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

    // Listen for the "notification" event from the server
    socket.on("notification", () => {
      console.log("notification");
      setUnreadProjectMessages((prevState) => ({
        ...prevState,
        projectId: (prevState.projectId || 0) + 1,
      }));
    }
    );

    return () => {
      socket.off("notification");
    }
  }, [])

  return (
    <StateContext.Provider
      value={{
        cart,
        setCart,
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        unreadProjectMessages,
        setUnreadProjectMessages,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export default ContextProvider;
