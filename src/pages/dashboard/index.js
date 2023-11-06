import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import axios from "axios";
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

const UserPanel = ({ user }) => {
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const [scheduledProjectsCount, setScheduledProjectsCount] = useState(0);
  const [revisionProjectsCount, setRevisionProjectsCount] = useState(0);
  const [awaitingProjectsCount, setAwaitingProjectsCount] = useState(0);
  const [cancelledProjectsCount, setCancelledProjectsCount] = useState(0);

  useEffect(() => {
    const fetchProjectsCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}projects/getOngoingProjectsCountByUser/${user._id}`
        );
        setOngoingProjectsCount(response.data.ongoingProjectsCount);
        setCompletedProjectsCount(response.data.completedProjectsCount);
        setScheduledProjectsCount(response.data.scheduledProjectsCount);
        setRevisionProjectsCount(response.data.revisionProjectsCount);
        setAwaitingProjectsCount(response.data.awaitingApprovalProjectsCount);
        setCancelledProjectsCount(response.data.cancelledProjectsCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjectsCount();
    const intervalId = setInterval(fetchProjectsCount, 30000); // Fetch every 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user._id]);

  const totalProjects =
    ongoingProjectsCount +
    completedProjectsCount +
    scheduledProjectsCount +
    revisionProjectsCount +
    awaitingProjectsCount +
    cancelledProjectsCount;

  const [chartMeta, setChartMeta] = useState({
    totalProjects: totalProjects,
    displayCount: totalProjects,
  });

  const data = {
    labels: [
      "Ongoing",
      "Completed",
      "Scheduled",
      "Revision",
      "Awaiting",
      "Cancelled",
    ],
    datasets: [
      {
        data: [
          ongoingProjectsCount,
          completedProjectsCount,
          scheduledProjectsCount,
          revisionProjectsCount,
          awaitingProjectsCount,
          cancelledProjectsCount,
        ],
        backgroundColor: [
          "rgba(243, 153, 63, 1)",
          "green",
          "blue",
          "purple",
          "yellow",
          "red",
        ],
      },
    ],
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
        },
      },
    },
  };

  return (
    <div className="flex flex-col justify-center py-2 font-poppins gap-3">
      <main className="text-center">
        <h1 className="text-2xl font-bold border-b-2 border-[#555555] border-rounded-md">
          Welcome, {user.firstName} {user.lastName}!
        </h1>
      </main>
      <div>
        <h1 className="text-2xl md:text-3xl pb-3">At a Glance!</h1>
        <div className="bg-[#333333] pt-3 pb-3 rounded-md sm:w-[400px] sm:h-[450px] flex flex-col">
          <span className="text-center">Projects</span>
          <Doughnut data={data} options={options} key={totalProjects}/>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt_decode(token);
    if (decoded.type !== "user") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}users/getUserbyId/${decoded.id}`
    );
    const user = response.data;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { user },
    };
  } catch (err) {
    console.log("Error decoding JWT: ", err);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default UserPanel;
