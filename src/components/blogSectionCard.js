import Link from "next/link";

export const BlogCard = ({ blog }) => {
  return (
    <div
      className="p-3 flex flex-col w-full h-full justify-between text-white"
      onClick={() => {
        console.log(blog.title);
      }}
    >
      {/* <img src="/Logo.png" className="block mx-auto my-0 h-[30%]" /> */}
      <div className="pt-5 h-[60%] justify-between flex flex-col">
        <div className="text-xl font-bold">{blog.title}</div>
        <div className="flex flex-col items-center">
          <div className="text-[14px]">{`${blog.author} • `}</div>
          <div className="text-[14px]">{blog.date}</div>
        </div>
      </div>
      <Link
        href={`/blogs/${blog._id}`}
        className="p-1 bg-orange-900 rounded-xl text-sm"
      >
        Read Full Article
      </Link>
    </div>
  );
};
