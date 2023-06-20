import { portfolioVariants } from "../../helper/motion";
import axios from "axios";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import styles from "../../styles";
import { HiPlay } from "react-icons/hi";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStars ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <TiStarFullOutline
          key={index}
          className="text-yellow-400 w-4 h-4 mr-1"
        />
      ))}
      {halfStars && (
        <TiStarHalfOutline className="text-yellow-400 w-4 h-4 mr-1" />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <TiStarOutline key={index} className="text-yellow-400 w-4 h-4 mr-1" />
      ))}
    </div>
  );
};

export default function PortfolioPage({ portfolios }) {
  const [activeImageIndexes, setActiveImageIndexes] = useState(
    portfolios.map(() => 0)
  );
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setActiveImageIndexes((activeImageIndexes) =>
      activeImageIndexes.map((activeImageIndex, portfolioIndex) => {
        const imageCount =
          portfolios[portfolioIndex].url.length +
          portfolios[portfolioIndex].images.length;
        return Math.max(0, Math.min(activeImageIndex, imageCount - 1));
      })
    );
  }, [portfolios]);

  const changeImageIndex = (portfolioIndex, newIndex) => {
    setActiveImageIndexes((activeImageIndexes) => {
      const newIndexes = [...activeImageIndexes];
      const mediaCount =
        portfolios[portfolioIndex].url.length +
        portfolios[portfolioIndex].images.length;
      if (newIndex < 0) {
        newIndex = mediaCount - 1; // Go to the last media item
        setDirection(-1);
      } else if (newIndex >= mediaCount) {
        newIndex = 0; // Go to the first media item
        setDirection(1);
      } else {
        setDirection(newIndex > activeImageIndexes[portfolioIndex] ? 1 : -1);
      }
      newIndexes[portfolioIndex] = newIndex;
      return newIndexes;
    });
  };

  return (
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto flex flex-col text-white font-poppins`}
    >
      <div>
        <h4 className="text-white md:text-[64px] text-[50px] font-extrabold">
          Portfolios
        </h4>
        <div className="mb-[50px] h-[2px] bg-white opacity-20" />
      </div>
      <div className="relative grid lg:grid-cols-2 gap-10 md:gap-20">
        <div className="gradient-03" />
        <div className="gradient-02" />
      {portfolios.map((portfolio, index) => {
        const media = [...portfolio.url, ...portfolio.images];
        return (
          <div className="items-center ">
            <div
              className={` text-center rounded-md  `}
            >
              <div className="relative w-full">
                <div style={{ paddingBottom: "56.25%" }} />
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeImageIndexes[index]}
                    custom={direction}
                    variants={portfolioVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 flex items-center justify-center rounded-t-lg overflow-hidden"
                  >
                    {activeImageIndexes[index] < portfolio.url.length ? (
                      <ReactPlayer
                        url={media[activeImageIndexes[index]]}
                        controls={true}
                        // light={true}
                        // playIcon={
                        //   <button className="text-orange-600 bg-white hover:text-orange-800 rounded-full w-18 h-18">
                        //     <HiPlay className="w-16 h-16" />
                        //   </button>
                        // }
                        className="object-cover"
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <img
                        src={media[activeImageIndexes[index]]}
                        className="rounded-t-lg"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={() =>
                    changeImageIndex(index, activeImageIndexes[index] - 1)
                  }
                  className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-800 p-2 font-bold text-white rounded-md"
                >
                  &lt;
                </button>
                <button
                  onClick={() =>
                    changeImageIndex(index, activeImageIndexes[index] + 1)
                  }
                  className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-800 p-2 font-bold text-white rounded-md"
                >
                  &gt;
                </button>
              </div>
            <div
              className={`rounded-b-lg bg-[#222222]  p-2 ${
                index % 2 === 0 ? "lg:order-last" : "lg:order-first"
              }`}
            >
              <h1 className="text-[24px] text-center font-bold tracking-wide">
                {portfolio.title}
              </h1>
              {/* <div className="text-[20px] text-[#dddddd]">
                {portfolio.description}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-[#BBBBBB]">{portfolio.clientName}</h3>
                <RatingStars rating={portfolio.stars} />
              </div> */}
            </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getAllPortfolio`
  );
  const portfolios = res.data;
  return {
    props: {
      portfolios,
    },
  };
}
