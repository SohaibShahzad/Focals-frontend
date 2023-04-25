import axios from "axios";
import styles from "../../styles";
import ReactPlayer from "react-player";
import classes from "../../styles/portfolio.module.css";

import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

export default function PortfolioPage({ portfolios }) {
  return (
    <div className={`${styles.paddings} flex flex-col text-white`}>
      <div>
        <h4 className="text-white md:text-[64px] text-[50px] font-extrabold">
          Portfolios
        </h4>
        <div className="mb-[50px] h-[2px]  bg-white opacity-20" />
      </div>
      <div className={`${styles.innerWidth} mx-auto ${styles.flexCenter}`}>
        <div className={`${classes.swiper}`}>
          <div
            className={`${classes["swiper-container"]} flex flex-col gap-[3rem]`}
          >
            {portfolios.map((video) => (
              <div className=" glassmorphism p-5 rounded-2xl">

                <div key={video._id} className={`${classes["swiper-slide"]}`}>
                  <ReactPlayer
                    url={video.url}
                    className={`${classes["swiper-video"]}`}
                  />
                </div>
                  <div className="text-center text-[24px] mt-2">{video.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getAllPortfolio`
  );
  const portfolios = res.data;
  console.log(portfolios);
  return {
    props: {
      portfolios,
    },
  };
}
