import { TypingText, TitleText } from "../components/customText";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { BlogCarousel } from "../components/blogCarousel";
import { Button } from "../components/button";

const BlogsSection = () => {
  return (
    <section className={`${styles.paddings}`} id="blogs">
      <div className="gradient-02 z-[0]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <TypingText title="| Blogs" textStyles="text-center" />
        <TitleText
          title={<>Fuel Your Curiosity</>}
          textStyles="text-center pb-[50px]"
        />
        <div className="text-center flex items-center flex-col">
          <BlogCarousel />
          <Button
            title="Explore Further >"
            styling="bg-[#621000] mt-[50px] hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white hover:font-bold"
            link="/blogs"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default BlogsSection;
