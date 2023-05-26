import ServicesPanel from "../../../sections/adminPanelSections/adminServices";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

export default function AdminServices({ services }) {
  return <ServicesPanel services={services} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const role = decoded.role[0];

  if (!role.includes("services")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }


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
