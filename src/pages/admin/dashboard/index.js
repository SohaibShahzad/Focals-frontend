import axios from "axios";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const jwt_decode = jwt.decode;

const centerTextPlugin = {
  id: "centerText",
  afterDatasetsUpdate: (chart, options, elements) => {
    let totalValue = 0;

    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((segment, index) => {
      console.log("Segment " + index + " hidden status:", segment.hidden);
      // Modify this part
      if (!segment.hidden || segment.hidden === undefined) {
        totalValue += chart.data.datasets[0].data[index];
      }
    });

    const width = chart.chartArea.right;
    const height = chart.chartArea.bottom;
    const textX = Math.round((chart.chartArea.left + width) / 2);
    const textY = Math.round((chart.chartArea.top + height) / 2);

    chart.$totalValue = {
      totalValue,
      x: textX,
      y: textY,
    };

    console.log(
      "Plugin afterDatasetsUpdate executed. Total value:",
      totalValue
    );
  },
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "bold 20px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    if (chart.$totalValue) {
      ctx.fillText(
        chart.$totalValue.totalValue,
        chart.$totalValue.x,
        chart.$totalValue.y
      );
    }
    ctx.restore();

    console.log("Plugin afterDraw executed.");
  },
};

ChartJS.register(
  centerTextPlugin,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = "Poppins, sans-serif";

export default function AdminDashboarding({ admin }) {
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalSubAdminsCount, setTotalSubAdminsCount] = useState(0);
  const [totalServicesCount, setTotalServicesCount] = useState(0);
  const [totalBlogsCount, setTotalBlogsCount] = useState(0);

  useEffect(() => {
    const getProjectsCount = async () => {
      const projectsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getTotalProjectsCount`
      );
      const p_data = projectsResponse.data;
      setOngoingProjectsCount(p_data.totalOngoingProjects);
      setCompletedProjectsCount(p_data.totalCompletedProjects);
    };

    const getUsersCount = async () => {
      const usersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}users/getTotalUsersCount`
      );
      const u_data = usersResponse.data;
      setTotalUsersCount(u_data.totalUsers);
    };

    const getSubadminsCount = async () => {
      const subadminsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}subAdmins/getTotalSubAdmins`
      );
      const sa_data = subadminsResponse.data;
      setTotalSubAdminsCount(sa_data);
    };

    const getServicesCount = async () => {
      const servicesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}services/getTotalServicesCount`
      );
      const s_data = servicesResponse.data;
      setTotalServicesCount(s_data);
    };

    const getBlogsCount = async () => {
      const blogsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}blogs/getTotalBlogsCount`
      );
      const b_data = blogsResponse.data;
      setTotalBlogsCount(b_data);
    };

    getProjectsCount();
    getUsersCount();
    getSubadminsCount();
    getServicesCount();
    getBlogsCount();

    const intervalId = setInterval(getProjectsCount, 30000); // Fetch every 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [admin._id]);

  const [chartMeta, setChartMeta] = useState({
    totalProjects: ongoingProjectsCount + completedProjectsCount,
    displayCount: ongoingProjectsCount + completedProjectsCount,
  });

  const data = {
    labels: ["Ongoing", "Completed"],
    datasets: [
      {
        data: [ongoingProjectsCount, completedProjectsCount],
        backgroundColor: ["rgba(243, 153, 63, 1)", "green"],
      },
    ],
  };
  const handleLegendOnClick = (e, legendItem) => {
    // Do nothing
  };
  
  const options = {
    responsive: true,
    centerTextMeta: chartMeta, 
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 18,
          },
          onClick: () => null, // Do nothing on legend click
        },
      },
    },
  };
  
  

  return (
    <div className="flex flex-col font-poppins justify-center py-2 gap-3">
      <main className="text-center">
        <h1 className="text-2xl font-bold border-b-2 border-[#555555] border-rounded-md">
          Welcome, {admin.username}!
        </h1>
      </main>
      <div className="flex flex-col lg:flex-row gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl pb-3">At a Glance</h1>
          <div className="glassmorphism-projects pt-3 pb-3 rounded-md sm:w-[400px] sm:h-[450px] flex flex-col">
            <span className="text-center">Projects</span>
            <Doughnut data={data} options={options} />
            {/* <span className="absolute top-[23rem] left-[32rem]">100</span> */}
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl pb-3">Summary</h1>
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <div className="glassmorphism-projects pb-3 sm:w-[200px] rounded-md overflow-hidden flex flex-col text-center justify-between gap-3">
              <div className="h-[7px] bg-orange-600" />
              <h1 className="text-lg text-[#CCCCCC] px-3">Registered Users</h1>
              <p className="text-3xl font-bold px-3 text-center">
                {totalUsersCount}
              </p>
            </div>
            <div className="glassmorphism-projects pb-3 sm:w-[200px] rounded-md overflow-hidden flex flex-col text-center justify-between gap-3">
              <div className="h-[7px] bg-orange-600" />
              <h1 className="text-lg text-[#CCCCCC] px-3">Active Sub-Admins</h1>
              <p className="text-3xl font-bold px-3 text-center">
                {totalSubAdminsCount}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 mt-3">
            <div className="glassmorphism-projects pb-3 sm:w-[200px] rounded-md overflow-hidden flex flex-col text-center justify-between gap-3">
              <div className="h-[7px] bg-orange-600" />
              <h1 className="text-lg text-[#CCCCCC] px-3">Active Services</h1>
              <p className="text-3xl font-bold px-3 text-center">
                {totalServicesCount}
              </p>
            </div>
            <div className="glassmorphism-projects pb-3 sm:w-[200px] rounded-md overflow-hidden flex flex-col text-center justify-between gap-3">
              <div className="h-[7px] bg-orange-600" />
              <h1 className="text-lg text-[#CCCCCC] px-3">Total Blogs</h1>
              <p className="text-3xl font-bold px-3 text-center">
                {totalBlogsCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt_decode(token);
    if (decoded.type !== "admin") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}admins/getAdminbyId/${decoded.id}`
    );
    const admin = response.data;

    if (!admin) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { admin },
    };
  } catch (err) {
    console.log("Error decoding JWT: ", err);
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
}
