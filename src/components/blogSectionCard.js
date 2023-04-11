import Link from "next/link";


export const BlogCard = ({ blog }) => {
  return (
    <div
      className="p-3 flex flex-col w-full h-full justify-between"
      onClick={() => {
        console.log(blog.title);
      }}
    >
      {/* <img src="/Logo.png" className="block mx-auto my-0 h-[30%]" /> */}
      <div className="pt-5 h-[60%]">
        <div className="text-xl font-bold">{blog.title}</div>
        <div>{`${blog.author} • `}</div>
        <div>
          {blog.date}
        </div>
      </div>
      <Link href={`/webApp/blogs/${blog._id}`} className="p-1 bg-orange-900 rounded-xl text-sm">Read Full Article</Link>
    </div>
  );
};
