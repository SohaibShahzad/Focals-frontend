import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import classes from "../styles/blogCarousel.module.css";
import { BlogCard } from "./blogSectionCard";
import Link from "next/link";

import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const BlogCarousel = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [blogData, setBlogData] = useState([]);
  const [maxWidthStyle, setMaxWidthStyle] = useState("");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 425 && window.innerWidth <= 625) {
        setSlidesPerView(2);
      } else if (window.innerWidth > 625 && window.innerWidth <= 865) {
        setSlidesPerView(3);
      } else if (window.innerWidth > 865) {

          setSlidesPerView(4);
        // }
      } else {
        setSlidesPerView(1);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getSpecialBlog`);
      setBlogData(res.data);
    }
    fetchData();
  }, []);

  return (
    <Swiper
      navigation
      // pagination={{
      //   clickable: true,
      //   renderBullet: function (index, className) {
      //     return `<span class="${className}"></span>`;
      //   },
      // }}
      modules={[Navigation]}
      slidesPerView={slidesPerView}
      spaceBetween={30}
      className={`${classes.swiper} ${maxWidthStyle}`}
    >
      <div className={`${classes["swiper-container"]} `}>
        {blogData.map((blog) => (
          <SwiperSlide key={blog._id} className={`${classes["swiper-slide"]} rounded-xl`}>

              <BlogCard blog={blog}/>

          </SwiperSlide>
        ))}
      </div>
    </Swiper>
  );
};
