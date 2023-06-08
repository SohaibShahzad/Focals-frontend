import ProjectsPanel from "../../../sections/adminPanelSections/adminProjects";
import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";

export default function Projects({ projectsData }) {
  return <ProjectsPanel projectsData={projectsData} />;
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  const decoded = jwt.decode(token);
  const role = decoded.role[0];

  if (!role.includes("projects")) {
    return {
      redirect: {
        destination: "/subadmin/dashboard",
        permanent: false,
      },
    };
  }

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getAllProjects`
  );
  const projectsData = res.data;
  return {
    props: {
      projectsData,
    },
  };
}
