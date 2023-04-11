
import classes from "../styles/carousel.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import axios from "axios";
import { EffectCards, Navigation } from "swiper";

import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

export const VideoCarousel = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("https://enigmatic-badlands-35417.herokuapp.com/portfolio/getSpecialPortfolio");
      setPortfolioData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Swiper
      effect={"cards"}
      cardsEffect={{ slideShadows: false }}
      grabCursor={true}
      navigation
      modules={[EffectCards, Navigation]}
      className={`${classes.swiper}`}
    >
      <div className={`${classes["swiper-container"]}`}>
        {portfolioData.map((video) => (
          <SwiperSlide key={video._id} className={`${classes["swiper-slide"]}`}>
            {isLoaded && (
              <ReactPlayer
                url={video.url}
                className={`${classes["swiper-video"]}`}
              />
            )}
          </SwiperSlide>
        ))}
      </div>
    </Swiper>
  );
};


