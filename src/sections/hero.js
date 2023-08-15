"use client";

import { motion } from "framer-motion";
import styles from "../styles";
import { slideIn, staggerContainer, textVariant } from "../helper/motion";
import classes from "../styles/hero.module.css";
import Link from "next/link";

const Hero = () => (
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
          Watch demo video
        </Link>

        <a
          onClick={() => {
            if (typeof Tawk_API !== "undefined") {
              Tawk_API.maximize();
            } else {
              console.error("Tawk.to API is not defined.");
            }
          }}
          className={`button-animation ${classes.buttonStyle} flex items-center z-40 border-orange-700 border-2`}
        >
          Let's have a talk
        </a>
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
