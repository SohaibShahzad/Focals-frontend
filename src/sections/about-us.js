'use client'

import { motion } from "framer-motion";
import styles from "../styles";
import { fadeIn, staggerContainer } from "../helper/motion";
import { TypingText } from "../components/customText";

const AboutUs = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-[0]" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="| About FutureFocals" textStyles="text-center" />
      <motion.p
        variants={fadeIn("up", "tween", 0.2, 1)}
        className="mt-[25px] font-normal sm:text-[20px] text-[18px] text-justify text-secondary-white"
      >
        <span className="font-extrabold">Welcome to our world of visual storytelling.</span> 
        <span className="font-extrabold"> At FutureFocals </span> 
        we are a passionate team of video editors, animators, and
        creators who love nothing more than bringing ideas to life. We
        understand that every project is unique, and we approach each one with
        an open mind and a commitment to excellence. Our focus is on creating
        engaging content that captivates your audience and communicates your message with impact.
        <span className="font-extrabold"> At our core, we are storytellers, </span> 
        and we believe that every great story deserves to be told
        in the most compelling way possible. Whether you need a promotional
        video, an explainer animation, or a full-scale production, we are here
        to bring your vision to life. Thank you for considering us as your
        creative partner, and we look forward to working with you to 
        <span className="font-extrabold"> create something truly exceptional.</span>
      </motion.p>
      <motion.img
        variants={fadeIn("up", "tween", 0.5, 1)}
        src="/arrow-down.svg"
        className="w-[18px] h-[28px] mt-[25px] object-contain"
      />
    </motion.div>

  </section>
);

export default AboutUs;
