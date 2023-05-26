import ServicesPanel from "../../../sections/adminPanelSections/adminServices";
import axios from "axios";

export default function AdminServices({ services }) {
  return <ServicesPanel services={services} />;
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}services/getAllServices`
  );

  const services = res.data;
  console.log(services);
  return {
    props: {
      services,
    },
  };
}
