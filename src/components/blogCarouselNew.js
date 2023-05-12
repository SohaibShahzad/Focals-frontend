import { useEffect, useState, useRef } from "react";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
// import { Dialog } from "@mui/material";
import Link from "next/link";

export const CustomCarousel = ({ items, itemsToShow = 3 }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef();
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    setVisibleItems(items.slice(currentIndex, currentIndex + itemsToShow));
  }, [currentIndex, items, itemsToShow]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - itemsToShow) {
      setCurrentIndex(currentIndex + 1);
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
            <div
              key={item._id}
              className="glassmorphism rounded-xl justify-between h-full"
            >
              <div className="flex justify-center items-center h-[150px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-t-xl w-[100%] h-[100%] object-cover"
                />
              </div>
              <div className="p-5 flex flex-col">
                <div>
                  <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                    {item.title}
                  </h3>
                </div>
                <div>
                  <span className="text-sm text-gray-400">by:</span>
                  <p className="pt-2 md:pt-1 text-[18px]">{item.author}</p>
                  <p className="text-[18px] pb-2">{item.date}</p>

                </div>
                <Link
                  href={`/blogs/${item._id}`}
                  className="text-center bg-orange-700 hover:bg-orange-900 font-bold rounded-md py-2 md:px-5 px-3 cursor-pointer"
                >
                  Read Blog
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      {items.length > itemsToShow && (
        <div className="space-x-5">
          <button className="" onClick={handlePrev}>
            <BsFillArrowLeftSquareFill className="text-orange-500 w-8 h-8 " />
          </button>
          <button className="" onClick={handleNext}>
            <BsFillArrowRightSquareFill className="text-orange-500 w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};
