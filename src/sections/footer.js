"use client";

import { motion } from "framer-motion";
import { socials } from "../routes/footerLinks";
import styles from "../styles";
import { footerVariants } from "../helper/motion";
import Link from "next/link";

const Footer = () => (
  <motion.footer
    variants={footerVariants}
    initial="hidden"
    whileInView="show"
    className={`${styles.paddings} py-8 relative font-poppins`}
  >
    <div className="footer-gradient" />
    <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px]  bg-white opacity-10"/>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-white">
            <h4 className="font-extrabold text-[24px]">Future Focals</h4>
            <div className="flex flex-row text-[12px] gap-4 underline text-secondary-white">
              <button href="#">Privacy Policy</button>
              <button href="#">Terms & Conditions</button>
            </div>
          </div>
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2023 FutureFocals. All rights reserved
          </p>
          <div className="flex gap-4">
            {socials.map((social, index) => (
              <img
                key={index}
                src={social.url}
                alt={social.name}
                className="w-[24px] h-[24px] object-contain cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
