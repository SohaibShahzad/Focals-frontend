import { TypingText, TitleText } from "../components/customText";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/button";
import { CustomCarousel } from "../components/blogCarouselNew";

const BlogSection = () => {
  const [blogData, setBlogData] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(3);

  const updateItemsToShow = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      setItemsToShow(1);
    } else if (screenWidth < 768) {
      setItemsToShow(2);
    } else if (screenWidth < 1024) {
      setItemsToShow(3);
    } else {
      setItemsToShow(3);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getSpecialBlog`
      );
      setBlogData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return (
    <section className={`${styles.paddings} relative z-30`} id="blogs">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col font-poppins`}
      >
        <div className={`font-tungsten`}>
          <TypingText title="Blogs" />
        </div>
        <div className="z-40">
          <div className={`${styles.yPaddings} text-white gap-5`}>
            <CustomCarousel items={blogData} itemsToShow={itemsToShow} />
          </div>
        </div>
        <Button
          title="Explore Further >"
          styling="font-poppins text-white"
          link="/blogs"
        />
      </motion.div>
    </section>
  );
};

export default BlogSection;
