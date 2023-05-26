import TestimonialsPanel from "../../../sections/adminPanelSections/adminTestimonials";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

export default function AdminTestimonials({ testimonials }) {
  return <TestimonialsPanel testimonials={testimonials} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const role = decoded.role[0];

  if (!role.includes("testimonials")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }


  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}testimonials/getAllTestimonials`
  );
  const testimonials = res.data;
  return {
    props: {
      testimonials,
    },
  };
}
