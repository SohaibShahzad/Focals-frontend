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
import { IoIosArrowDown } from "react-icons/io";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import {
  TbSquareRoundedChevronDownFilled,
  TbSquareRoundedChevronRightFilled,
  TbArrowNarrowRight,
} from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const NavBar = () => {
  const { asPath } = useRouter();
  const [chevronMenu, setChevronMenu] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [categoryWiseServices, setCategoryWiseServices] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
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
  const servicesMenuRef = useRef(null);
  const cartRef = useRef(null);
  const [user, setUser] = useState({});
  const props = {
    signup: false,
    signin: true,
  };

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const userData = cookies.user;
    try {
      setUser(jwt_decode(token));
    } catch (error) {}
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
      const servicesRawData = resServices.data;
      const categoryWiseServices = {};

      for (const service of servicesRawData) {
        const category = service.category;
        if (!categoryWiseServices[category]) {
          categoryWiseServices[category] = [];
        }
        categoryWiseServices[category].push(service);
      }
      setServicesData(servicesRawData);
      setCategoryWiseServices(categoryWiseServices);
    }
    // async function fetchServiceData() {
    //   const serviceData = await axios.get(
    //     `${process.env.NEXT_PUBLIC_SERVER_URL}services/getServicesTitle`
    //   );
    //   setServiceTitleData(serviceData.data);
    //   console.log(serviceData.data);
    // }
    fetchData();

    // fetchServiceData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => {
          setShowDropdown(false);
        }, 100);
      }
      if (
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setChevronMenu(false);
        }, 100);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setTimeout(() => {
          setShowCart(false);
        }, 100);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.addEventListener("scroll", handleClickOutside);
    };
  }, [dropdownRef, servicesMenuRef, cartRef]);

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
    if (!query.includes(" ")) {
      // Check if query contains a space
      return [];
    }
    const queryWords = query.split(" ").filter((word) => word.length > 0); // Exclude any empty strings
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
      {(showCart || chevronMenu) &&  (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-40" />
      )}
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
                  className={`flex relative px-1   ${
                    index === mainNavLinks.length - 1 ? "mr-0" : "mr-4"
                  } ${
                    asPath === link.link
                      ? "bg-orange-700 rounded-[5px] scale-110"
                      : ""
                  } `}
                >
                  {link.title === "Services" ? (
                    <div>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setChevronMenu((prev) => !prev);
                          }}
                          className="nav-item transform transition-all duration-300  hover:px-1"
                        >
                          {link.title}
                        </button>
                        {chevronMenu && link.title === "Services" ? (
                          <TbSquareRoundedChevronRightFilled
                            className="w-6 h-6 ml-1 cursor-pointer transform transition-all duration-300 hover:scale-125"
                            onClick={() => {
                              setChevronMenu(false);
                            }}
                          />
                        ) : (
                          <TbSquareRoundedChevronDownFilled
                            className="w-6 h-6 ml-1 cursor-pointer transform transition-all duration-300 hover:scale-125"
                            onClick={() => {
                              setChevronMenu(true);
                            }}
                          />
                        )}
                      </div>
                      {chevronMenu && link.title === "Services" && (
                        <div className="hover:transition-none bg-gray-800 absolute top-10 right-0 px-5 py-3 navbar-sm-animation rounded-[5px]">
                          <p className="flex justify-center font-semibold underline pb-2">
                            Categories
                          </p>
                          <div
                            className="flex gap-5 columns-2 border-b-2 border-gray-600"
                            ref={servicesMenuRef}
                          >
                            {Object.keys(categoryWiseServices).map(
                              (category, index) => (
                                <div
                                  key={index}
                                  style={{
                                    "border-left":
                                      index === 0 ? "" : "2px solid gray",
                                    "padding-left": index === 0 ? "" : "20px",
                                    "margin-bottom": "10px",
                                  }}
                                >
                                  <h4 style={{ "white-space": "nowrap" }} className="pb-2">
                                    {category}
                                  </h4>
                                  <div className="flex flex-col gap-1">

                                  {categoryWiseServices[category].map(
                                    (service) => (
                                      <Link href={`/services/${service._id}`}>
                                        <p className="text-gray-400 text-[14px] flex items-center transform transition-all duration-300 hover:scale-110 hover:text-white">
                                          <TbArrowNarrowRight className="w-8 h-5" />
                                          <span
                                            style={{ "white-space": "nowrap" }}
                                          >
                                            {service.title}
                                          </span>
                                        </p>
                                      </Link>
                                    )
                                  )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <Link
                            href="/services"
                            className="opacity-50 text-sm mt-2 flex items-center justify-end transform transition-all duration-250 hover:opacity-100 hover:underline"
                          >
                            View all services{" "}
                            <TbSquareRoundedChevronRightFilled className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.link}
                      className="nav-item transform transition-all duration-300 hover:px-1"
                    >
                      {link.title}
                    </Link>
                  )}
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
                    <HiShoppingCart className="w-5 h-5" />
                    {totalQuantity > 0 && (
                      <span className="absolute top-[-10px] right-[-10px] bg-orange-400 text-black font-bold px-2 rounded-full">
                        {totalQuantity}
                      </span>
                    )}
                  </button>
                </li>
                {showCart && (
                  <div
                    ref={cartRef}
                    className="fixed top-0 right-0 px-4 py-3 slide-rtl-animation bg-gray-800 rounded-tl-md rounded-bl-md h-full w-[300px] z-50"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-[22px] font-extrabold underline">
                        Cart
                      </h2>
                      {cart.length > 0 && (
                        <button
                          onClick={() => setCart([])}
                          className="opacity-50 flex items-center hover:opacity-100 transition transform-all duration-300 rounded-md px-1 hover:bg-orange-600"
                        >
                          <AiFillDelete />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                    {cart.length > 0 ? (
                      <>
                        <div className="flex flex-col gap-2 p-2 h-[calc(100vh-200px)] overflow-y-auto">
                          {cart.map((item) => (
                            <>
                              <div className="justify-between items-center ">
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
                        <div className="flex items-center gap-3 justify-end pt-[10px]">
                          Total:
                          <span className="font-bold text-[20px]">
                            ${calculateTotalPrice()}
                          </span>
                        </div>
                        <Link
                          href="/cart-checkout"
                          className="bg-orange-800 button-animation-reverse hover:scale-100 rounded-md mt-2 py-1 items-center flex justify-center"
                        >
                          Proceed
                        </Link>
                        <Link
                          href="/services"
                          className="border-orange-800 button-animation hover:scale-100 border-2 rounded-md mt-2 py-1 items-center flex justify-center"
                        >
                          Continue Shopping
                        </Link>
                      </>
                    ) : (
                      <div className="flex flex-col items-center my-auto">
                        <p>No Item</p>
                        <Link
                          href="/services"
                          className="bg-orange-800 button-animation-reverse rounded-md mt-2 py-1 items-center flex justify-center"
                        >
                          Let's Shop!!
                        </Link>
                      </div>
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
                <div className="absolute right-0 top-10 p-2 rounded-md bg-gray-800 px-4 navbar-sm-animation ">
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
                  className="flex items-center gap-1 ml-4 bg-orange-700 hover:bg-orange-500 transform transition-all duration-300 hover:scale-110 rounded-full p-1 "
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  {isAdmin ? (
                    <span className="bg-white text-orange-600 rounded-full px-2 font-extrabold">
                      Admin
                    </span>
                  ) : isSub ? (
                    <span className="bg-white text-orange-600 rounded-full px-2 font-extrabold">
                      Sub
                    </span>
                  ) : (
                    <FaUserCircle className="w-7 h-7 " />
                  )}
                  <span>{user.firstName}</span>
                  <IoIosArrowDown />
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute top-10 right-0 mt-2 rounded-lg bg-gray-800 navbar-sm-animation z-50"
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
                href={`/login?prop=${encodeURIComponent(
                  JSON.stringify(props)
                )}`}
                className="button-animation-reverse ml-5 bg-orange-700 rounded-md px-5 py-1"
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
                  className="mr-3 bg-orange-700 rounded-full p-1 flex items-center gap-1"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setToggle(false);
                  }}
                >
                  <FaUserCircle className="w-7 h-7 !important" />
                  <span>{user.firstName}</span>
                  <IoIosArrowDown />
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="space-y-1 p-6 absolute right-10 top-20 mt-2 rounded-lg bg-gray-800 navbar-sm-animation"
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
                href={`/login?prop=${encodeURIComponent(
                  JSON.stringify(props)
                )}`}
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
                ref={mobileMenuRef}
                className={`${
                  toggle ? "flex" : "hidden"
                } p-6 bg-gray-800 navbar-sm-animation absolute top-20 right-0 mx-4 my-2 rounded-xl`}
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
