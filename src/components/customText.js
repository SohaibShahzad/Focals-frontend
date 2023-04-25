import { motion } from "framer-motion";
import { textContainer, textVariant2 } from "../helper/motion";

export const TypingText = ({ title }) => (
    <motion.p
        variants={textContainer}
        className={`text-[36px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[56px] tracking-[0.15em] font-bold`}
    >
        {Array.from(title).map((char, index) => (
            <motion.span
                variants={textVariant2} key={index}
                className="text-white z-10"
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
    </motion.p>
);

export const TitleText = ({ title }) => (
    <motion.h2
        variants={textVariant2}
        initial="hidden"
        whileInView="show"
        className={`mt-[8px] md:text-[16px] lg:text-[18px] leading-snug text-[20px] text-secondary-white font-nova`}

    >
        {title}
    </motion.h2>
);
