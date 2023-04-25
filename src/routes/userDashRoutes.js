import { RxDashboard } from "react-icons/rx";
import { MdHistory, MdPayment } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";

export const userDashLinks = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Overview",
        icon: <RxDashboard />,
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "Projects",
        icon: <CgWebsite />,
      },
      {
        name: "History",
        icon: <MdHistory />,
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        name: "Account",
        icon: <FiSettings />,
      },
      {
        name: "Payment",
        icon: <MdPayment />,
      },
    ],
  },
];
