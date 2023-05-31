import axios from "axios";
import styles from "../../styles";
import { useState } from "react";

export default function SingleBlog({ blogData }) {
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const openFullScreen = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins`}>
      <div className="md:flex md:flex-row md:justify-between md:items-center md:gap-5">
        <div className="md:text-[64px] text-[40px] text-center md:text-left font-extrabold ">
          {blogData.title}
        </div>
        <div>
          <div className="text-gray-400">by:</div>
          <div className="text-[20px] font-bold">{blogData.author}</div>
        </div>
      </div>
      <div className="mb-[30px] h-[2px]  bg-white opacity-20" />
      <div className="flex justify-end mb-[10px] font-bold text-[15px] md:text-[24px]">
        {blogData.date}
      </div>
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center cursor-zoom-out"
          onClick={closeFullScreen}
        >
          <img
            src={fullScreenImage}
            alt="Fullscreen Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="space-y-10">
        <div className="max-h-[250px] md:max-h-[500px] overflow-y-auto">
          <img
            src={blogData.image}
            alt={blogData.title}
            onClick={() => openFullScreen(blogData.image)}
            className="rounded-xl w-[100%] object-cover cursor-zoom-in"
          />
        </div>
        <div className="text-justify glassmorphism-projects p-5 rounded-2xl">
          <p className="leading-8 text-[20px] text-gray-100 tracking-wide" dangerouslySetInnerHTML={{ __html: blogData.content }}/>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getBlogWithImage/${id}`
  );
  const blogData = res.data;
  return {
    props: {
      blogData,
    },
  };
}
