import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { Dialog } from "@mui/material";
import { IoCloseCircle } from "react-icons/io5";

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

export const CustomCarousel = ({ items, itemsToShow = 3 }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef();
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
    <div
      ref={carouselRef}
      className="relative flex flex-col items-center gap-10"
    >
      <div className="gradient-03" />
      <div className={`gap-5 flex transition-all duration-500 ease-in-out`}>
        {items.length === 0 ? (
          <div
            className={`p-5 glassmorphism rounded-lg h-[200px] w-full md:w-[80%] lg:w-[60%] mx-2 overflow-y-auto`}
          >
            <div className="flex flex-col gap-5 justify-center items-center">
              <h3 className="text-[24px]">No testimonials available</h3>
            </div>
          </div>
        ) : (
          visibleItems.map((item, index) => (
            <motion.div
              key={item._id}
              className="p-5 glassmorphism-projects rounded-lg w-full md:w-[80%] lg:w-[60%] mx-2 flex flex-col justify-between"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <div className="grid grid-rows-[auto,1fr,auto] gap-5 h-full justify-between">
                {" "}
                <RatingStars rating={item.stars} />
                <div>
                  <h3 className="text-[24px]">{item.testimonialHeading}</h3>
                  <button
                    className="text-orange-500"
                    onClick={() => {
                      setCurrentDialog(item);
                      setOpenDialog(true);
                    }}
                  >
                    ... Read Full
                  </button>
                </div>
                <p className="text-[#BBBBBB] font-bold text-[20px]">{item.name}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {items.length > itemsToShow && (
        <div className="space-x-5 z-30">
          <button className="" onClick={handlePrev}>
            <BsFillArrowLeftSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9" />
          </button>
          <button className="" onClick={handleNext}>
            <BsFillArrowRightSquareFill className="text-orange-600 hover:text-orange-800 rounded-md bg-white w-9 h-9" />
          </button>
        </div>
      )}
      <Dialog open={openDialog} className="bg-black bg-opacity-20">
        <div className="bg-[#222222] text-white font-poppins p-6 flex flex-col gap-4">
          <div className="flex justify-between">
            <RatingStars rating={currentDialog.stars} />
            <IoCloseCircle
              className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] cursor-pointer font-bold text-orange-400 hover:text-orange-800"
              onClick={() => {
                setOpenDialog(false);
              }}
            />
          </div>
          <div className="text-[20px] font-bold tracking-wide text-center">
            {currentDialog.testimonialHeading}
          </div>
          <div className="text-justify">{currentDialog.testimonialData}</div>
          <h3 className="text-right font-bold">{currentDialog.name}</h3>
        </div>
      </Dialog>
    </div>
  );
};
