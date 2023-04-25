import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jsonwebtoken";
import Router from "next/router";
import { parseCookies } from "nookies";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    if(token){
      try{
        const decoded = jwt_decode(token)
        if(decoded){
          setAuthenticated(true)
        }
      } catch(err){
        console.log("Error decoding JWT: ", err)
      }
    } else {
      if(Router.pathname.startsWith("/dashboard")){
        Router.push("/login")
      }
    }
  }, [])
  const value = {
    authenticated,
    setAuthenticated
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
