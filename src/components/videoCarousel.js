import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { portfolioVariants } from "../helper/motion";

const variants = {
  visible: (direction = 0) => {
    return {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
      },
    };
  },
  hidden: (direction = 0) => {
    return {
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    };
  },
};

export const VideoCarousel = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getSpecialPortfolio`
      );

      // Iterate through the data and push only the URLs into the portfolioData array
      const urlArray = [];
      res.data.forEach((item) => {
        item.url.forEach((url) => {
          urlArray.push(url);
        });
      });
      setPortfolioData(urlArray);
      console.log(portfolioData);
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
    <div
      className=""
      style={{ maxWidth: "80%", margin: "0 auto", width: "100%" }}
    >
      <div style={{ paddingBottom: "56.25%" }} />

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          custom={direction}
          key={currentVideoIndex}
          variants={portfolioVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className=" w-full overflow-hidden"
        >
          <ReactPlayer
            url={portfolioData[currentVideoIndex]}
            className="absolute top-0 object-cover"
            width="100%"
            height="100%"
          />
        </motion.div>
      </AnimatePresence>
      <button
        onClick={() => paginate(-1)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md z-10"
      >
        &lt;
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-2 font-bold text-white rounded-md z-10"
      >
        &gt;
      </button>
    </div>
  );
};
