import AdminRealtime from "../../../sections/adminPanelSections/adminRealtime";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

const jwt_decode = jwt.decode;

export default function AdminUsersChat({ usersData }) {
  return <AdminRealtime usersData={usersData} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt_decode(token);
  const role = decoded.role[0];

  if (!role.includes("realtime chat")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}users/getAllUsers`
  );
  const usersData = response.data;

  return {
    props: {
      usersData,
    },
  };
}