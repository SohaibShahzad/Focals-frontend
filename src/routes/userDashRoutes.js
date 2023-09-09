import { RxDashboard } from "react-icons/rx";
import { MdHistory, MdPayment } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import { IoChatbubblesOutline } from "react-icons/io5";

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
      //   name: "Chat",
      //   icon: <IoChatbubblesOutline />,
      //   linkName: "/live-chat",
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
