import Router from "next/router";

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authenticated") === "true";
  }
};

export const logout = () => {
  localStorage.removeItem("authenticated");
  Router.push("/login");
};