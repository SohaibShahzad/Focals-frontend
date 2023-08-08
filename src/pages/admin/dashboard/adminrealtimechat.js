import AdminRealtimePanel from "../../../sections/adminPanelSections/adminRealtimePanel";
import axios from "axios";

export default function AdminRealtime({ usersData }) {
  return <AdminRealtimePanel usersData={usersData} />;
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}users/getAllUsers`
  );
  const usersData = res.data;
  return {
    props: {
      usersData,
    },
  };
}
