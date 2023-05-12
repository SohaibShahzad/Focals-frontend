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
        linkName: "",
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "Projects",
        icon: <CgWebsite />,
        linkName: "/projects",
      },
      // {
      //   name: "History",
      //   icon: <MdHistory />,
      //   linkName: "/history",
      // },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        name: "Account",
        icon: <FiSettings />,
        linkName: "/account",
      },
      // {
        //   name: "Payment",
        //   icon: <MdPayment />,
        // linkName: "/payment",
        // },
    ],
  },
];
