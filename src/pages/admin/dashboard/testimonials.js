import TestimonialsPanel from "../../../sections/adminPanelSections/adminTestimonials";
import axios from "axios";

export default function AdminTestimonials({ testimonials }) {
  return <TestimonialsPanel testimonials={testimonials} />;
}

export async function getServerSideProps() {
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
