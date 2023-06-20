import ProjectsPanel from "../../../sections/adminPanelSections/adminProjects";
import axios from "axios";

export default function AdminProjects({ initialProjectsData }) {
  return <ProjectsPanel initialProjectsData={initialProjectsData} />;
}

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getAllProjects`
  );
  const initialProjectsData = response.data;

  return {
    props: {
      initialProjectsData,
    },
  };
}
