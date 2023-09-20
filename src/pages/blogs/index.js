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
        <h1 className="text-[28px] sm:text-[34px] md:text-[50px] font-extrabold light-text ">
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
        <div className="flex flex-row gap-9 flex-wrap md:flex-nowrap justify-end">
          <div className="flex flex-col">
            <span className="light-text text-right">
              Search by Title
            </span>
            <input
              placeholder="Enter Title"
              type="text"
              className="bg-[#333333] p-2 border-2 w-[250px] rounded-md border-orange-700"
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
            className="glassmorphism-projects hover:bg-orange-800 rounded-xl justify-between h-full overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
            <div className="flex justify-center items-center h-[150px] sm:h-[250px]">
              <img
                src={blog.image}
                alt={blog.title}
                className="rounded-t-xl w-[100%] h-[100%] object-cover transform transition-all duration-300 hover:scale-110"
                />
            </div>
            <div className="py-3 px-2 flex flex-col">
              <div>
                <h3 className="text-center font-bold text-[24px]">
                  {blog.title}
                </h3>
              </div>
              <div>
                <p className="text-[16px] text-center text-[#AAAAAA] mt-2 font-bold">{blog.date}</p>
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
