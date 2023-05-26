import BlogsPanel from "../../../sections/adminPanelSections/adminBlogs";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

export default function AdminBlogs({ blogs }) {
  return <BlogsPanel blogs={blogs} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const role = decoded.role[0];

  if (!role.includes("blogs")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }

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
