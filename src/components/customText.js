import { motion } from "framer-motion";
import { textContainer, textVariant2 } from "../helper/motion";

export const TypingText = ({ title, textStyles }) => (
    <motion.p
        variants={textContainer}
        className={`${textStyles} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold`}
    >
        {Array.from(title).map((char, index) => (
            <motion.span
                variants={textVariant2} key={index}
                className="text-secondary-white"
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
    </motion.p>
);

export const TitleText = ({ title, textStyles }) => (
    <motion.h2
        variants={textVariant2}
        initial="hidden"
        whileInView="show"
        className={`mt-[8px] md:text-[64px] leading-snug text-[40px] ${textStyles} font-bold text-white`}

    >
        {title}
    </motion.h2>
);
