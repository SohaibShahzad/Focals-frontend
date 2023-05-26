"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RiSearchLine } from "react-icons/ri";
import styles from "../styles";
import { navVariants } from "../helper/motion";
import classes from "../styles/navbar.module.css";
import { mainNavLinks } from "../routes/mainNavLinks";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { parseCookies } from "nookies";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const [filter, setFilter] = useState("");
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const cookies = parseCookies();
  const token = cookies.token;
  const isAuthenticated = !!token;
  const isUser = token ? jwt_decode(token).type === "user" : false;

  useEffect(() => {
    async function fetchData() {
      const resServices = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
      );
      setServicesData(resServices.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => {
          setShowDropdown(false);
        }, 100);
      }
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setShowSearch(false);
        }, 100);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [dropdownRef, searchBarRef]);

  const handleLogout = async () => {
    try {
      await axios.delete("/api/session", { withCredentials: true });
      localStorage.removeItem("token");
      setShowDropdown(false);
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  const handleSearch = (query) => {
    if (query.length < 3) {
      return [];
    }
    return servicesData.filter((service) =>
      service.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchResults = handleSearch(searchQuery);

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
        <Link href="/" className="z-10 flex flex-row items-center gap-1">
          <img src="/Logo.png" alt="FutureFocals" />
          <span className="flex hidden md:flex text-white font-extrabold text-[16px] md:text-[20px]">
            FutureFocals
          </span>
        </Link>

        <div className={`${classes.menuItems}`}>
          <ul className="list-none md:flex hidden justify-end items-center">
            {mainNavLinks.map((link, index) => (
              <li
                key={index}
                className={`${
                  index === mainNavLinks.length - 1 ? "mr-0" : "mr-4"
                }`}
              >
                <Link href={link.link}>{link.title}</Link>
              </li>
            ))}
            <div className="relative">
              <div>
                <button
                  className="ml-4 bg-orange-700 rounded-full p-2 hidden md:flex"
                  onClick={() => {
                    setShowSearch((prev) => !prev);
                    setSearchQuery("");
                  }}
                >
                  <RiSearchLine className="w-5 h-5" />
                </button>
              </div>
              {showSearch && (
                <div className="absolute right-0 top-10 p-2 rounded-md bg-black-gradient px-4 navbar-sm-animation ">
                  <input
                    type="text"
                    ref={searchBarRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Services"
                    className="bg-transparent border-[3px] border-[#5f2300] z-50 mt-2 rounded-lg p-2 mb-2"
                  />

                  {searchQuery && (
                    <ul>
                      <div className="text-gray-400">Result:</div>
                      {searchResults.map((service) => (
                        <li
                          key={service._id}
                          className="navbar-sm-animation mb-2 group"
                        >
                          <Link href={`/services/${service._id}`}>
                            <div className="flex items-center justify-between gap-3 glassmorphism rounded-md px-2 hover:bg-orange-800">
                              <img
                                src={service.thumbnail}
                                alt={service.title}
                                className="w-10 h-10"
                              />
                              <p className="text-white font-semibold">
                                {service.title}
                              </p>
                              <MdKeyboardArrowRight className="w-10 h-10 opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {isAuthenticated && isUser ? (
              <div>
                <button
                  className="ml-4 bg-orange-700 rounded-full p-1"
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
          <div className="md:hidden flex flex-1 justify-end items-center">
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
                } p-6 bg-gray-900 navbar-sm-animation absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl`}
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
                  <div className="flex flex-col">
                    <input
                      type="text"
                      onClick={(e) => e.stopPropagation()}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                      placeholder="Search Services"
                      className=" bg-transparent border-[3px] border-[#5f2300] z-50 mt-5 rounded-lg p-2"
                    />
                    {searchQuery && (
                    <ul>
                      {searchResults.length > 0 && <div className="text-gray-400">Result:</div>}
                      {searchResults.map((service) => (
                        <li
                          key={service._id}
                          className="navbar-sm-animation mb-2 group"
                        >
                          <Link href={`/services/${service._id}`}>
                            <div className="flex items-center justify-between gap-3 pl-2 glassmorphism rounded-md hover:bg-orange-800">
                              <img
                                src={service.thumbnail}
                                alt={service.title}
                                className="w-10 h-10"
                              />
                              <p className="text-white font-semibold">
                                {service.title}
                              </p>
                              <MdKeyboardArrowRight className="w-10 h-10" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                    {/* <div
                      className="flex items-center justify-end text-gray-400 mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterToggle((prev) => !prev);
                      }}
                    >
                      <span>Filters</span>
                      {filterToggle ? (
                        <MdKeyboardArrowDown className="w-6 h-6" />
                      ) : (
                        <MdKeyboardArrowRight className="w-6 h-6" />
                      )}
                    </div> */}
                    {/* {filterToggle && (
                      <div className="flex justify-evenly">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="searchFilter"
                            id="blogSearch"
                            value="blogSearch"
                            checked={filter === "blogSearch"}
                            onChange={() => setFilter("blogSearch")}
                            className="cursor-pointer rounded-md h-4 w-4"
                          />
                          <label
                            htmlFor="blogSearch"
                            className="text-[16px] select-none cursor-pointer"
                          >
                            Blogs
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="searchFilter"
                            id="serviceSearch"
                            value="serviceSearch"
                            checked={filter === "serviceSearch"}
                            onChange={(e) => {
                              setFilter("serviceSearch");
                            }}
                            className="cursor-pointer rounded-md h-4 w-4"
                          />
                          <label
                            htmlFor="serviceSearch"
                            className="text-[16px] select-none cursor-pointer"
                          >
                            Services
                          </label>
                        </div>
                      </div>
                    )} */}
                  </div>
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
