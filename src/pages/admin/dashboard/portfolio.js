import PortfolioPanel from "../../../sections/adminPanelSections/adminPortfolio";
import axios from "axios";

export default function AdminPortfolio({ portfolios }) {
  return <PortfolioPanel portfolios={portfolios} />;
}

export async function getServerSideProps() {
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
