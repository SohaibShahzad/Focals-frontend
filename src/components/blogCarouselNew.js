import { useEffect, useState, useRef } from "react";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef();
  const [visibleItems, setVisibleItems] = useState([]);
  const [direction, setDirection] = useState(0);

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
      <div className={`gap-5 flex transition-all duration-500 ease-in-out`}>
        {items.length === 0 ? (
          <div className={`p-5 glassmorphism rounded-lg h-full mx-2`}>
            <div className="flex flex-col gap-5 justify-center items-center">
              <h3 className="text-[24px]">No blogs available</h3>
            </div>
          </div>
        ) : (
          visibleItems.map((item, index) => (
            <motion.div
              key={item._id}
              custom={direction}
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
              <Link
                key={item._id}
                href={`/blogs/${item._id}`}
                className="glassmorphism hover:bg-orange-500 rounded-xl justify-between h-full overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center items-center h-[150px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-t-xl w-[100%] h-[100%] object-cover transform transition-all duration-300 hover:scale-110"
                  />
                </div>
                <div className="px-5 py-3 flex flex-col">
                  <div>
                    <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-center mt-3 text-gray-300">
                    {item.date}
                  </p>
                </div>
              </Link>
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
      )}
    </div>
  );
};
