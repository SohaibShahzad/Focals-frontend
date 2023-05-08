import { useEffect, useState, useRef } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

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
              <h3 className="text-[24px]">No testimonials available</h3>
            </div>
          </div>
        ) : (
          visibleItems.map((item, index) => (
            <div
              key={item._id}
              className="p-5 glassmorphism rounded-lg h-full mx-2 flex flex-col justify-between items-center"
            >
              <div className="flex flex-col gap-5 justify-between">
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
                <p className=" font-bold text-[20px]">{item.name}</p>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentDialog.name}</DialogTitle>
        <DialogContent>
          {currentDialog.testimonialData}
        </DialogContent>
      </Dialog>
    </div>
  );
};