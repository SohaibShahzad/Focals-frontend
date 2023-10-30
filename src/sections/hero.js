"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles";
import { slideIn, staggerContainer, textVariant } from "../helper/motion";
import classes from "../styles/hero.module.css";
import Link from "next/link";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const Hero = () => {
  const [userLoggedin, setUserLoggedin] = useState(false);
  const props = {
    signup: false,
    signin: true,
  };

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const auth = !!token;
    setUserLoggedin(auth ? jwt_decode(token).type === "user" : false);
  }, []);

  return (
    <section className={`${styles.yPaddings} my-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col z-30`}
      >
        <div className="flex justify-center items-center flex-col sm:flex-row relative gap-2 ">
          <motion.h1
            variants={textVariant(0.2)}
            className={`${styles.heroHeading}`}
          >
            Our Services Will Help
          </motion.h1>
          <motion.h1
            variants={textVariant(0.5)}
            className={`${styles.heroHeading}`}
          >
            You To Grow
          </motion.h1>
        </div>
        <motion.div
          variants={slideIn("right", "tween", 0.2, 0.75)}
          className="relative w-full md:-mt-[20px] mt-[12px]"
        >
          <motion.div
            className={`text-white text-center mt-7 font-nova px-5 sm:px-[60px] md:px-[140px] text-[20px]`}
          >
            We Specialize in crafting visually stunning videos that captivate
            audiences and elevate brands. Let us help you tell your story like
            never before.
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row justify-center items-center text-white mt-7 gap-5">
          <Link
            href="/portfolio"
            className={`button-animation-reverse ${classes.buttonStyle} flex items-center z-30 `}
          >
            Our Showcase
          </Link>
          <Link
            className={`button-animation ${classes.buttonStyle} flex items-center z-40 border-orange-700 border-2`}
            href={
              userLoggedin
                ? "/dashboard/live-chat"
                : `/login?prop=${encodeURIComponent(JSON.stringify(props))}`
            }
          >
            Let's have a talk
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
