import React, { createContext, useContext, useState, useEffect, useReducer } from "react";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESET_CART':
      return {
        ...state,
        cart: [],
      };
      default:
        return state;
  }
}

const ContextProvider = ({ children }) => {
  const cookies = parseCookies();
  const token = cookies.token;
  let userId;
  if (token) {
    const decodedToken = jwt_decode(token);
    userId = decodedToken?.id;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const [cart, setCart] = useState([]);

  const resetCart = () => {
    dispatch({ type: 'RESET_CART' });
    const cartName = userId ? `${userId}_cart` : "guest_cart";
    localStorage.removeItem(cartName);
  }
  
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

  return (
    <StateContext.Provider
      value={{
        ...state,
        resetCart,
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export default ContextProvider;
