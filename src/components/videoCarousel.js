import classes from "../styles/carousel.module.css";
import useYoutubeIframeAPI from "../hooks/useYouTubeIframeAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactPlayer from "react-player";
import YouTube from "react-youtube";
import { useEffect, useState } from "react";
import axios from "axios";
import { EffectCards, Navigation } from "swiper";

import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

export const VideoCarousel = () => {
  useYoutubeIframeAPI();
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

// function extractYoutubeIdFromUrl(url) {
//   const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//   const match = url.match(regex);
//   return match && match[2].length === 11 ? match[2] : null;
// }
