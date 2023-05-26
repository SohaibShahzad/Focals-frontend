import { useState } from "react";
import Link from "next/link";
import styles from "../../styles";
import axios from "axios";
import { MdTune } from "react-icons/md";

export default function BlogsPage({ blogs }) {
  const [tagFilter, setTagFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterToggle, setFilterToggle] = useState(false);

  const filteredBlogs = blogs.filter((blog) => {
    let includeTitle =
      titleFilter === "" ||
      blog.title.toLowerCase().includes(titleFilter.toLowerCase());
    return includeTitle;
  });
  return (
    <div className={`${styles.paddings} text-white font-poppins`}>
      <div className="flex justify-between items-center">
        <h1 className="md:text-[64px] text-[50px] font-extrabold light-text ">
          Our Blogs
        </h1>
        <div
          className="object-contain cursor-pointer"
          onClick={() => setFilterToggle((prev) => !prev)}
        >
          <MdTune style={{ color: "white", fontSize: "2rem" }} />
        </div>
      </div>
      <div className="mb-[50px] h-[2px]  bg-white opacity-20" />

      {filterToggle ? (
        <div className="flex flex-row gap-9 flex-wrap md:flex-nowrap">
          <div>
            <label htmlFor="title-filter" className="light-text mx-5">
              Filter by Title:
            </label>
            <input
              placeholder="Enter Title"
              type="text"
              className="text-gray-700 px-5 py-1.5 rounded-md placeholder:text-gray-700"
              id="title-filter"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 m-4 ">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="glassmorphism rounded-xl justify-between h-full"
          >
            <div className="flex justify-center items-center h-[150px]">
              <img src={blog.image} alt={blog.title} className="rounded-t-xl w-[100%] h-[100%] object-cover" />
            </div>
            <div className="p-5 flex flex-col">
              <div>
                <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                  {blog.title}
                </h3>
              </div>
              <div>
                <span className="text-sm text-gray-400">by:</span>
                <p className="pt-2 md:pt-1 text-[18px] pb-2">{blog.author}</p>
              </div>
              <Link
                href={`/blogs/${blog._id}`}
                className="text-center bg-orange-900 font-bold rounded-md py-2 md:px-5 px-3 cursor-pointer"
              >
                Read Blog
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getAllBlogs`
  );
  const blogs = res.data;
  return {
    props: {
      blogs,
    },
  };
}
