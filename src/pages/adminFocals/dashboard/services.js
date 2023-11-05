import ServicesPanel from "../../../sections/adminPanelSections/adminServices";
import axios from "axios";

export default function AdminServices({ services }) {
  return <ServicesPanel services={services} />;
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
  );
  const categories = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getCategories`
  );

  const services = res.data;
  const uniqueCategories = categories.data;

  return {
    props: {
      services,
      uniqueCategories,
    },
  };
}
