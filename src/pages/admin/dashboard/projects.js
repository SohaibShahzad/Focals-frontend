import ProjectsPanel from "../../../sections/adminPanelSections/adminProjects";
import axios from "axios";

export default function AdminProjects({ projectsData }) {
  return <ProjectsPanel projectsData={projectsData} />;
}

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getAllProjects`
  );
  const projectsData = response.data;

  return {
    props: {
      projectsData,
    },
  };
}
