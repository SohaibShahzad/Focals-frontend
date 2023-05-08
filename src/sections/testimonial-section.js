import { TypingText, TitleText } from "../components/customText";
import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { CustomCarousel } from "../components/testimonialCarousel";

const TestimonialSection = () => {
  const [testimonialData, setTestimonialData] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(4);

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
        `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/getAllTestimonials`
      );
      setTestimonialData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return (
    <section className={`${styles.paddings} relative z-30`} id="testimonials">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <div className={`font-tungsten`}>
          <TypingText title="Testimonials" />
        </div>
        <div className="z-40">
          <div className={`${styles.yPaddings} text-white gap-5`}>
            <CustomCarousel items={testimonialData} itemsToShow={itemsToShow} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
