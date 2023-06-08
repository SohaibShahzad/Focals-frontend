import { staggerContainer, portfolioVariants } from "../helper/motion";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles";
import { TypingText } from "../components/customText";
import { HiPlay } from "react-icons/hi";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/button";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";

const Explore = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getSpecialPortfolio`
      );
      const urlArray = [];
      res.data.forEach((item) => {
        item.url.forEach((url) => {
          urlArray.push(url);
        });
      });
      setPortfolioData(urlArray);
    }
    fetchData();
  }, []);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentVideoIndex(
      (prevIndex) =>
        (prevIndex + newDirection + portfolioData.length) % portfolioData.length
    );
  };

  return (
    <section className={`${styles.paddings} relative z-30`} id="explore">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
      >
        <div className={`font-tungsten`}>
          <TypingText title="Explore" />
        </div>
        <div
          className={`${styles.yPaddings} text-center relative`}
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <div className="aspect-wrapper">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                custom={direction}
                key={currentVideoIndex}
                variants={portfolioVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden"
              >
                <ReactPlayer
                  url={portfolioData[currentVideoIndex]}
                  className="object-cover"
                  controls={true}
                  light={true}
                  playIcon={
                    <button className="text-orange-600 bg-white hover:text-orange-800 rounded-full w-18 h-18">
                      <HiPlay className="w-16 h-16" />
                    </button>
                  }
                  width="98%"
                  height="98%"
                />
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => paginate(-1)}
              className="absolute -left-5 top-1/2 transform -translate-y-1/2 font-bold text-white rounded-md"
            >
              <BsFillArrowLeftSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9"/>
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute -right-5 top-1/2 transform -translate-y-1/2 font-bold text-white rounded-md"
            >
            <BsFillArrowRightSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9"/>
            </button>
          </div>
        </div>

        <Button
          title="Explore Further >"
          styling="bg-orange-700 font-poppins hover:bg-orange-800 hover:drop-shadow-[0_5px_5px_rgba(255,167,49,0.25)] text-white hover:font-bold"
          link="/portfolio"
        />
      </motion.div>
    </section>
  );
};

export default Explore;
