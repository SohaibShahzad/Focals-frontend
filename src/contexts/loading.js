import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const useStateContext = () => useContext(StateContext);

export const StateProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [screenSize, setScreenSize] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        loading,
        setLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
