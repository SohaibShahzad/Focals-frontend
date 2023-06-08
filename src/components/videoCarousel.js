import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
import { HiPlay } from "react-icons/hi";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStars ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <TiStarFullOutline
          key={index}
          className="text-yellow-400 w-5 h-5 mr-1"
        />
      ))}
      {halfStars && (
        <TiStarHalfOutline className="text-yellow-400 w-5 h-5 mr-1" />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <TiStarOutline key={index} className="text-yellow-400 w-5 h-5 mr-1" />
      ))}
    </div>
  );
};

export const VideoCarousel = ({ items, itemsToShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    setVisibleItems(items.slice(currentIndex, currentIndex + itemsToShow));
  }, [currentIndex, items, itemsToShow]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDirection(-1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - itemsToShow) {
      setCurrentIndex(currentIndex + 1);
      setDirection(1);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-10">
      <div className="gradient-03"/>
      <div className="gap-5 flex transition-all duration-500 ease-in-out">
        {items.length === 0 ? (
          <div className={`p-5 glassmorphism rounded-lg h-full mx-2`}>
            <div className="flex flex-col gap-5 justify-center items-center">
              <h3 className="text-[24px]">No blogs available</h3>
            </div>
          </div>
        ) : (
          visibleItems.map((item, index) => (
            <motion.div
              custom={direction}
              key={item._id}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full md:w-[80%] lg:w-[60%] mx-2 flex flex-col justify-between"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="glassmorphism-projects rounded-lg">
                <ReactPlayer
                  url={item.url[0]}
                  controls={true}
                  // light={true}
                  playIcon={
                    <button className="text-orange-600 bg-white hover:text-orange-800 rounded-full w-18 h-18">
                      <HiPlay className="w-16 h-16" />
                    </button>
                  }
                  className="object-cover "
                  width="auto"
                  height="auto"
                />
                <div className="flex flex-col py-4 items-center font-poppins justify-center">

                  <h3 className="text-[24px]">{item.title}</h3>
                  <RatingStars rating={item.stars} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {items.length > itemsToShow && (
        <div className="space-x-5">
          <button className="" onClick={handlePrev}>
            <BsFillArrowLeftSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9 " />
          </button>
          <button className="" onClick={handleNext}>
            <BsFillArrowRightSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9" />
          </button>
        </div>
      )}{" "}
    </div>
  );
};
