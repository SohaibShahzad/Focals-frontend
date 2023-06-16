import { staggerContainer } from "../helper/motion";
import { motion } from "framer-motion";
import styles from "../styles";
import { TypingText } from "../components/customText";
import { VideoCarousel } from "../components/videoCarousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/button";

const Explore = () => {
  const [portfolioData, setPortfolioData] = useState([]);
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getSpecialPortfolio`
      );
      setPortfolioData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return (
    <section className={`${styles.paddings} relative z-30`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <div className={`font-tungsten`}>
          <TypingText title="Explore" />
        </div>

        <div className="z-40">
          <div className={`${styles.yPaddings} text-white gap-5`}>
            <VideoCarousel items={portfolioData} itemsToShow={itemsToShow} />
          </div>
        </div>
        <Button
          title="Explore Further >"
          styling="font-poppins text-white"
          link="/portfolio"
        />
      </motion.div>
    </section>
  );
};

export default Explore;
