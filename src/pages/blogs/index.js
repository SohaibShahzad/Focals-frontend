import { useState } from "react";
import Link from "next/link";
import styles from "../../styles";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

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
    <div
      className={`${styles.innerWidth} ${styles.xPaddings} mx-auto text-white font-poppins`}
    >
      <div className="flex justify-between items-center">
        <h1 className="md:text-[64px] text-[50px] font-extrabold light-text ">
          Our Blogs
        </h1>
        <div
          className="object-contain cursor-pointer"
          onClick={() => setFilterToggle((prev) => !prev)}
        >
          <FiSearch style={{ color: "white", fontSize: "2rem" }} />
        </div>
      </div>
      <div className="mb-[20px] h-[2px]  bg-white opacity-20" />

      {filterToggle ? (
        <div className="flex flex-row gap-9 flex-wrap md:flex-nowrap">
          <div>
            <label htmlFor="title-filter" className="light-text mx-5">
              Search by Title:
            </label>
            <input
              placeholder="Enter Title"
              type="text"
              className="bg-[#333333] p-2 border-2 rounded-md border-orange-700"
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
          <Link
            key={blog._id}
            href={`/blogs/${blog._id}`}
            className="glassmorphism hover:bg-orange-500 rounded-xl justify-between h-full overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
            <div className="flex justify-center items-center h-[150px]">
              <img
                src={blog.image}
                alt={blog.title}
                className="rounded-t-xl w-[100%] h-[100%] object-cover transform transition-all duration-300 hover:scale-110"
                />
            </div>
            <div className="p-5 flex flex-col">
              <div>
                <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                  {blog.title}
                </h3>
              </div>
              <div>
                <span className="text-sm text-gray-400">by:</span>
                <p className="text-[18px]">{blog.author}</p>
              </div>
              
            </div>
          </Link>
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
