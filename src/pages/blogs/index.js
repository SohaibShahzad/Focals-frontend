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
    // let includeTag = tagFilter === "" || blog.tags.includes(tagFilter);
    let includeTitle =
      titleFilter === "" ||
      blog.title.toLowerCase().includes(titleFilter.toLowerCase());
    // let includeDate =
    //   dateFilter === "" || new Date(blog.date) >= new Date(dateFilter);
    // return includeTag && includeTitle && includeDate;
    return includeTitle;
  });
  return (
    <div className={`${styles.paddings} text-white`}>
      <div className="flex justify-between items-center">

      <h1 className="md:text-[64px] text-[50px] font-extrabold light-text ">Our Blogs</h1>
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
          {/* <div className="mb-5">
            <label htmlFor="tag-filter" className="light-text">
              Filter by Tag:
            </label>
            <select
              id="tag-filter"
              className="text-gray-700 px-5 py-1.5 rounded-md"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">All Tags</option>
              <option value="4">t1</option>
              <option value="tag2">Tag 2</option>
              <option value="tag3">Tag 3</option>
            </select>
          </div> */}
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
          {/* <div>
            <label htmlFor="date-filter" className="light-text mx-5">
              Filter by Date:
            </label>
            <input
              type="date"
              id="date-filter"
              className="text-gray-700 px-5 py-1.5 rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div> */}
        </div>
      ) : (
        <div></div>
      )}

      {/* <input
        type="text"
        placeholder="Search Blogs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      /> */}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-4 ">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="p-5 glassmorphism rounded-xl mb-5 flex gap-5 flex-col justify-between h-full"
          >
            <div >
              <h3 className="text-center font-bold text-[24px] border-b-2 border-gray-600 pb-1 ">
                {blog.title}
              </h3>
            </div>
            <div>

              <span className="text-sm text-gray-400">by:</span>
              <p className="pt-2 md:pt-1 text-[18px] pb-2">
                {blog.author}
              </p>
            </div>

            <Link
              href={`/blogs/${blog._id}`}
              className="text-center bg-orange-900 font-bold rounded-md py-2 md:px-5"
            >
              Read Full Article
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getAllBlogs`);
  const blogs = res.data;
  return {
    props: {
      blogs,
    },
  };
}
