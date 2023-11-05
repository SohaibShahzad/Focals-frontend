import BlogsPanel from "../../../sections/adminPanelSections/adminBlogs";
import axios from "axios";

export default function AdminBlogs({ blogs }) {
  return <BlogsPanel blogs={blogs} />;
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
