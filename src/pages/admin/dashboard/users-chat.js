import AdminRealtime from "../../../sections/adminPanelSections/adminRealtime";
import axios from "axios";

export default function AdminUsersChat({ usersData }) {
    return <AdminRealtime usersData={usersData} />;
}

export async function getServerSideProps() {
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
