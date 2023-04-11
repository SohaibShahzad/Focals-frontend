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
    className={`${styles.paddings} py-8 relative`}
  >
    <div className="footer-gradient" />
    <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <h4 className="text-white font-bold md:text-[64px] text-[44px]">
          Let's Discuss Your Project
        </h4>
        <Link
          href='/webApp/contact-us'
          className="flex items-center h-fit py-3 px-6 bg-orange-800 rounded-xl text-white gap-[12px]"
        >
          Let's Begin
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px]  bg-white opacity-10" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className="font-extrabold text-[24px] text-white">
            Future Focals
          </h4>
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
