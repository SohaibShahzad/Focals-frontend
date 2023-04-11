"use client";

import Link from "next/link";
import { Dialog } from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles";
import { navVariants } from "../helper/motion";
import classes from "../styles/navbar.module.css";
import { mainNavLinks } from "../routes/mainNavLinks";
import { CgMenuRight, CgClose } from "react-icons/cg";
import LoginRegisterForm from "./loginForm";

const NavBar = () => {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleLoginFormOpen = () => {
    setLoginFormOpen(true);
  };
  const handleLoginFormClose = () => {
    setLoginFormOpen(false);
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="absolute w-[50%] inset-0 gradient-010" />
      <div
        className={`${styles.innerWidth} mx-auto flex justify-between gap-4 items-center`}
      >
        <Link href="/" className="z-10 flex flex-row items-center gap-2">
          <img src="/Logo.png" alt="FutureFocals" />
          <span className="flex sm:hidden md:flex text-white font-extrabold text-[18px] md:text-[22px]">FutureFocals</span> 
        </Link>

        <div className={`${classes.menuItems} space-x-5`}>
          <ul className="list-none sm:flex hidden justify-end items-center flex-1">
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
          </ul>
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <div
              className="object-contain cursor-pointer"
              onClick={() => setToggle((prev) => !prev)}
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
                <ul className="list-none flex flex-col  justify-end items-center flex-1">
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
