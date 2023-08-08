"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { RiSearchLine } from "react-icons/ri";
import styles from "../styles";
import { navVariants } from "../helper/motion";
import classes from "../styles/navbar.module.css";
import { mainNavLinks } from "../routes/mainNavLinks";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { parseCookies } from "nookies";
import { FaUserCircle } from "react-icons/fa";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { TbLetterA, TbLetterS } from "react-icons/tb";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import axios from "axios";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const NavBar = () => {
  const { asPath } = useRouter();
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const { cart, setCart } = useStateContext();
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const auth = !!token;
    setIsAuthenticated(auth);
    setIsUser(auth ? jwt_decode(token).type === "user" : false);
    setIsAdmin(auth ? jwt_decode(token).type === "admin" : false);
    setIsSub(auth ? jwt_decode(token).type === "subadmin" : false);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const resServices = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServicesWithoutImages`
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
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setShowSearch(false);
        }, 100);
      }
      if (
        toggle &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setToggle(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef, mobileMenuRef, toggle]);

  const handleLogout = async () => {
    try {
      await axios.delete("/api/session", { withCredentials: true });
      localStorage.removeItem("token");
      setShowDropdown(false);
      setIsAuthenticated(false);
      setIsUser(false);
      setIsAdmin(false);
      setIsSub(false);
    } catch (err) {
      console.log("Error logging out: ", err);
    }
  };

  const handleSearch = (query) => {
    //! if include the below if it registers the search after we type a space in the search bar
    // if (!query.includes(" ")) {
    //   // Check if query contains a space
    //   return [];
    // }
    const queryWords = query.split(" ").filter((word) => word.length > 0);
    return servicesData.filter((service) =>
      queryWords.some((word) =>
        service.title.toLowerCase().includes(word.toLowerCase())
      )
    );
  };

  const searchResults = handleSearch(searchQuery);

  const totalQuantity = cart.reduce((total, item) => {
    return (
      total +
      item.bundles.reduce((bundleTotal, bundle) => {
        return bundleTotal + bundle.quantity;
      }, 0)
    );
  }, 0);

  const addToCart = (targetServiceId, targetBundle, action) => {
    let tempCart = cart.map((service) => {
      if (service.serviceId === targetServiceId) {
        let serviceCopy = { ...service };
        let targetBundleIndex = serviceCopy.bundles.findIndex(
          (bundle) => bundle.id === targetBundle.id
        );

        if (targetBundleIndex !== -1) {
          if (action === "increase") {
            serviceCopy.bundles[targetBundleIndex].quantity += 1;
          } else if (action === "decrease") {
            serviceCopy.bundles[targetBundleIndex].quantity -= 1;

            if (serviceCopy.bundles[targetBundleIndex].quantity === 0) {
              serviceCopy.bundles.splice(targetBundleIndex, 1);

              if (serviceCopy.bundles.length === 0) {
                return null;
              }
            }
          }
        }

        return serviceCopy;
      } else {
        return service;
      }
    });

    tempCart = tempCart.filter((item) => item !== null);
    setCart(tempCart);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cart.forEach((service) => {
      service.bundles.forEach((bundle) => {
        totalPrice += bundle.price * bundle.quantity;
      });
    });

    return totalPrice;
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
        <Link
          href="/"
          className="z-10 flex flex-row items-center gap-1 transform transition-all duration-300 hover:scale-110"
        >
          <img src="/Logo.png" alt="FutureFocals" />
          <span className="flex hidden md:flex text-white font-extrabold text-[16px] md:text-[20px]">
            FutureFocals
          </span>
        </Link>

        <div className={`${classes.menuItems}`}>
          <ul className="list-none lg:flex hidden justify-end items-center">
            <div className="nav-ul lg:flex hidden justify-end items-center">
              {mainNavLinks.map((link, index) => (
                <li
                  key={index}
                  className={`relative px-1 transform transition-all duration-300 hover:scale-110 ${
                    index === mainNavLinks.length - 1 ? "mr-0" : "mr-4"
                  } ${
                    asPath === link.link
                      ? "bg-orange-700 rounded-[5px] scale-110"
                      : ""
                  } nav-item`}
                >
                  <Link href={link.link}>{link.title}</Link>
                </li>
              ))}
            </div>
            {isAuthenticated && isUser && (
              <div className="relative">
                <li className="relative">
                  <button
                    className="ml-4 bg-orange-700 rounded-full p-2 hidden md:flex hover:bg-orange-500 transform transition-all duration-300 hover:scale-125"
                    onClick={() => {
                      setShowCart((prev) => !prev);
                    }}
                  >
                    <HiShoppingCart className="w-5 h-5 hover:w-6 hover:h-6 " />
                    {totalQuantity > 0 && (
                      <span className="absolute top-[-10px] right-[-10px] bg-orange-400 text-black font-bold px-2 rounded-full">
                        {totalQuantity}
                      </span>
                    )}
                  </button>
                </li>
                {showCart && (
                  <div className="absolute top-10 right-0 px-3 py-2 navbar-sm-animation bg-[#333333] rounded-md ">
                    {cart.length > 0 ? (
                      <>
                        <div className="flex flex-col gap-2 p-2">
                          {cart.map((item) => (
                            <>
                              <div className="justify-between items-center">
                                <div className="flex flex-col gap-10 justify-between">
                                  <span
                                    className="text-[18px] text-center mb-2"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    {item.serviceName}
                                  </span>
                                </div>
                                <div>
                                  <span className="space-y-2">
                                    {item.bundles.map((bundle, index) => {
                                      return (
                                        <div className="glassmorphism-projects px-2 rounded-md">
                                          <div className="flex flex-row justify-between items-center">
                                            <span className="font-bold">
                                              {bundle.name}
                                            </span>
                                            <div className="flex flex-col items-center">
                                              {/* <span>Qty:</span> */}
                                              <div className="flex gap-2 justify-center items-center">
                                                <span
                                                  className="text-orange-700 bg-white hover:text-orange-500 rounded-full cursor-pointer"
                                                  onClick={() =>
                                                    addToCart(
                                                      item.serviceId,
                                                      bundle,
                                                      "decrease"
                                                    )
                                                  }
                                                >
                                                  <FaMinusCircle className="w-6 h-6" />
                                                </span>
                                                <span className="text-[26px]">
                                                  {bundle.quantity}
                                                </span>
                                                <span
                                                  className="text-orange-700 bg-white hover:text-orange-500 rounded-full cursor-pointer"
                                                  onClick={() =>
                                                    addToCart(
                                                      item.serviceId,
                                                      bundle,
                                                      "increase"
                                                    )
                                                  }
                                                >
                                                  <FaPlusCircle className="w-6 h-6" />
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex justify-end gap-3 items-center">
                                            <span className="text-[14px]">
                                              Sub-total:
                                            </span>
                                            <span className="font-bold">
                                              ${bundle.price * bundle.quantity}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-white h-[3px] rounded-md opacity-10" />
                            </>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                          Total:
                          <span className="font-bold text-[20px]">
                            ${calculateTotalPrice()}
                          </span>
                        </div>
                        <Link
                          href="/cart-checkout"
                          className="bg-orange-800 hover:bg-orange-600 rounded-md mt-2 py-1 items-center flex justify-center"
                        >
                          Proceed
                        </Link>
                      </>
                    ) : (
                      <div>No Item</div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="relative">
              <button
                className="ml-4 bg-orange-700 hover:bg-orange-500 transform transition-all duration-300 hover:scale-125 rounded-full p-2 hidden md:flex"
                onClick={() => {
                  setShowSearch((prev) => !prev);
                  setSearchQuery("");
                  setToggle(false);
                }}
              >
                <RiSearchLine className="w-5 h-5 " />
              </button>
              {showSearch && (
                <div className="absolute right-0 top-10 p-2 rounded-md bg-gray-900 px-4 navbar-sm-animation ">
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
                            <div className="flex items-center justify-between glassmorphism rounded-md px-2 hover:bg-orange-800">
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
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="ml-4 bg-orange-700 hover:bg-orange-500 transform transition-all duration-300 hover:scale-125 rounded-full p-1 "
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  {isAdmin ? (
                    <TbLetterA className="w-7 h-7" />
                  ) : isSub ? (
                    <TbLetterS className="w-7 h-7" />
                  ) : (
                    <FaUserCircle className="w-7 h-7" />
                  )}
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute top-10 right-0 mt-2 rounded-lg bg-gray-900 navbar-sm-animation z-50"
                  >
                    <li className="mb-5 cursor-pointer">
                      <Link
                        href={
                          isAdmin
                            ? "/admin/dashboard"
                            : isSub
                            ? "/subadmin/dashboard"
                            : "/dashboard"
                        }
                      >
                        Dashboard
                      </Link>
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
          {/* //!Mobile Navbar */}
          <div className="lg:hidden flex flex-1 justify-end items-center">
            {isAuthenticated && isUser && (
              <div className="relative">
                <div className="relative">
                  <Link
                    className="mr-3 bg-orange-700 rounded-full p-1"
                    href="/cart-checkout"
                  >
                    <ShoppingCartRoundedIcon className="w-5 h-5" />
                    {totalQuantity > 0 && (
                      <span className="absolute top-[-10px] left-[-10px] bg-orange-400 text-black font-bold px-2 rounded-full">
                        {totalQuantity}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}
            {isAuthenticated ? (
              <div>
                <button
                  className="mr-3 bg-orange-700 rounded-full p-1 transform transition-all duration-300 hover:scale-125"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  {isAdmin ? (
                    <TbLetterA className="w-7 h-7" />
                  ) : isSub ? (
                    <TbLetterS className="w-7 h-7" />
                  ) : (
                    <FaUserCircle className="w-7 h-7" />
                  )}
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute right-10 top-20 mt-2 rounded-lg bg-gray-900 navbar-sm-animation"
                  >
                    <li className="mb-5 cursor-pointer">
                      <Link
                        href={
                          isAdmin
                            ? "/admin/dashboard"
                            : isSub
                            ? "/subadmin/dashboard"
                            : "/dashboard"
                        }
                      >
                        Dashboard
                      </Link>
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
              className="object-contain cursor-pointer "
              onClick={() => {
                setToggle((prev) => !prev);
                setShowDropdown(false);
              }}
            >
              {toggle ? (
                <CgClose
                  className="transform transition-all duration-300 hover:scale-125"
                  style={{ fontSize: "2rem" }}
                />
              ) : (
                <CgMenuRight
                  className="transform transition-all duration-300 hover:scale-125"
                  style={{ fontSize: "2rem" }}
                />
              )}
              <div
                ref={mobileMenuRef}
                className={`${
                  toggle ? "flex" : "hidden"
                } p-6 bg-gray-900 navbar-sm-animation absolute top-20 right-0 mx-4 my-2 rounded-xl`}
                style={{ maxWidth: "calc(100% - 4px)" }}
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
                      className="w-[200px] bg-transparent border-[3px] border-[#5f2300] z-50 mt-5 rounded-lg p-2"
                    />
                    {searchQuery && (
                      <ul>
                        {searchResults.length > 0 && (
                          <div className="text-gray-400">Result:</div>
                        )}
                        {searchResults.map((service) => (
                          <li
                            key={service._id}
                            className="navbar-sm-animation mb-2 group"
                          >
                            <Link href={`/services/${service._id}`}>
                              <div className="flex w-[200px] items-center justify-between gap-3 pl-2 glassmorphism rounded-md hover:bg-orange-800">
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
