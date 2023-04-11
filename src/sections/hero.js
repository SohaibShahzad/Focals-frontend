'use client'

import { motion } from "framer-motion";
import styles from "../styles";
import { slideIn, staggerContainer, textVariant } from "../helper/motion";

const Hero = () => (
  <section className={`${styles.yPaddings} sm:pl-16 pl-6`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <div className="flex justify-center items-center flex-col relative z-30">
        <motion.h1
          variants={textVariant(1.0)}
          className={`${styles.heroHeading}`}
        >
          Let's Get
        </motion.h1>
        <motion.h1
          variants={textVariant(1.5)}
          className={`${styles.heroHeading}`}
        >
          Creative!!
        </motion.h1>
      </div>
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="relative w-full md:-mt-[20px] -mt-[12px]"
      >
        <div className="absolute w-full h-[300px] rounded-tl-[140px] z-[0] -top-[50px]"/>
          <video
            autoPlay
            loop
            muted
            className="w-full -top-[50px] sm:h-[400px] h-[250px] object-cover rounded-tl-[50px] rounded-bl-[50px] z-[10] relative"
          >
            <source src="/heroVideo3.mp4" type="video/mp4" />
            Video Not Supported
          </video>

        {/* <a href="#explore">
          <div className="w-full flex -top-[50px] justify-end sm:-mt-[70px] -mt-[50px] pr-[40px] relative z-10">
            <img
              src="/stamp.png"
              alt="stamp"
              className="sm:w-[155px] w-[100px] sm:h-[155px] h-[100px] object-contain"
            />
          </div>
        </a> */}
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
