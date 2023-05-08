"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles";
import { navVariants } from "../helper/motion";
import classes from "../styles/navbar.module.css";
import { mainNavLinks } from "../routes/mainNavLinks";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { parseCookies } from "nookies";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import * as jwt from 'jsonwebtoken';
const jwt_decode = jwt.decode;


const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const cookies = parseCookies();
  const token = cookies.token;
  const isAuthenticated = !!token;
  const isUser = token ? jwt_decode(token).type === "user" : false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target))
      ) {
        setTimeout(() => {
          setShowDropdown(false);
        }, 100);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await axios.delete("/api/session", { withCredentials: true });
      localStorage.removeItem("token");
      setShowDropdown(false);
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative font-poppins`}
    >
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between gap-2 items-center`}
      >
        <Link href="/" className="z-10 flex flex-row items-center gap-2">
          <img src="/Logo.png" alt="FutureFocals" />
          <span className="flex hidden md:flex text-white font-extrabold text-[16px] md:text-[20px]">
            FutureFocals
          </span>
        </Link>

        <div className={`${classes.menuItems}`}>
          <ul className="list-none sm:flex hidden justify-end items-center">
            {mainNavLinks.map((link, index) => (
              <li
                key={index}
                className={`${
                  index === mainNavLinks.length - 1 ? "mr-0" : "mr-5"
                }`}
              >
                <Link href={link.link}>{link.title}</Link>
              </li>
            ))}
            {isAuthenticated && isUser ? (
              <div>
                <button
                  className="ml-5 bg-orange-700 rounded-full p-1"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  <FaUserCircle className="w-7 h-7 " />
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute right-10 top-20 mt-2 rounded-lg bg-black-gradient navbar-sm-animation z-50"
                  >
                    <li className="mb-5 cursor-pointer">
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li className="cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-5 bg-orange-700 rounded-md px-5 py-1"
              >
                Login
              </Link>
            )}
          </ul>
          <div className="sm:hidden flex flex-1 justify-end items-center">
            {isAuthenticated && isUser ? (
              <div>
                <button
                  className="mr-3 bg-orange-700 rounded-full p-1"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  <FaUserCircle className="w-7 h-7 !important" />
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute right-10 top-20 mt-2 rounded-lg bg-black-gradient navbar-sm-animation"
                  >
                    <li className="mb-5 cursor-pointer">
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li className="cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="mr-3 bg-orange-700 rounded-md px-5 py-1"
              >
                Login
              </Link>
            )}
            <div
              className="object-contain cursor-pointer"
              onClick={() => {
                setToggle((prev) => !prev);
                setShowDropdown(false);
              }}
            >
              {toggle ? (
                <CgClose style={{ fontSize: "2rem" }} />
              ) : (
                <CgMenuRight style={{ fontSize: "2rem" }} />
              )}
              <div
                className={`${
                  toggle ? "flex" : "hidden"
                } p-6 bg-black-gradient navbar-sm-animation absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl`}
              >
                <ul className="list-none flex flex-col justify-end items-center flex-1">
                  {mainNavLinks.map((link, index) => (
                    <li
                      key={index}
                      className={`${
                        index === mainNavLinks.length - 1 ? "mr-0" : "mb-5"
                      }`}
                    >
                      <Link href={link.link}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
