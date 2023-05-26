import PortfolioPanel from "../../../sections/adminPanelSections/adminPortfolio";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

export default function AdminPortfolio({ portfolios }) {
  return <PortfolioPanel portfolios={portfolios} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const role = decoded.role[0];

  if (!role.includes("portfolio")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }


  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}portfolio/getAllPortfolio`
  );
  const portfolios = res.data;
  return {
    props: {
      portfolios,
    },
  };
}
