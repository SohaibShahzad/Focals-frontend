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
    const totalValue = chart.config.data.datasets[0].data.reduce(
      (a, b) => a + b,
      0
    );
    const width = chart.chartArea.right;
    const height = chart.chartArea.bottom;
    const textX = Math.round((chart.chartArea.left + width) / 2);
    const textY = Math.round((chart.chartArea.top + height) / 2);

    chart.$totalValue = {
      totalValue,
      x: textX,
      y: textY,
    };
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

    getProjectsCount();
    getUsersCount();
    getSubadminsCount();

    const intervalId = setInterval(getProjectsCount, 30000); // Fetch every 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [admin._id]);

  const data = {
    labels: ["Ongoing", "Completed"],
    datasets: [
      {
        data: [ongoingProjectsCount, completedProjectsCount],
        backgroundColor: ["rgba(243, 153, 63, 1)", "green"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 18,
          },
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
          <h1 className="text-2xl md:text-3xl pb-3">At a Glance!</h1>
          <div className="bg-[#333333] pt-3 pb-3 rounded-md sm:w-[400px] sm:h-[450px] flex flex-col">
            <span className="text-center">Projects</span>
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl pb-3">Personnel!</h1>
          <div className="flex flex-col gap-3">
            <div className="bg-[#333333] p-3 rounded-md flex flex-row justify-between gap-5">
              <h1 className="text-xl md:text-2xl">Users:</h1>
              <p className="text-2xl">{totalUsersCount}</p>
            </div>
            <div className="bg-[#333333] p-3 rounded-md flex flex-row justify-between gap-5">
              <h1 className="text-xl md:text-2xl">Sub-Admins:</h1>
              <p className="text-2xl">{totalSubAdminsCount}</p>
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
    console.log(decoded);
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
