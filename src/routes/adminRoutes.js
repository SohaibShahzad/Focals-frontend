import { RxDashboard } from "react-icons/rx";
import {
  MdOutlineArticle,
  MdTrolley,
  MdOutlineCases,
  MdInfoOutline,
  MdMailOutline,
  MdOutlineRateReview,
} from "react-icons/md";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi";
import { RiAdminLine, RiChat1Line } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";
import { FiLink2 } from "react-icons/fi";

export const adminLinks = [
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
        name: "Blogs",
        icon: <MdOutlineArticle />,
        linkName: "/blogs",
      },
      {
        name: "Services",
        icon: <MdTrolley />,
        linkName: "/services",
      },
      {
        name: "Live Chat",
        icon: <RiChat1Line />,
        linkName: "/live-chat",
      },
      {
        name: "Portfolio",
        icon: <MdOutlineCases />,
        linkName: "/portfolio",
      },
      {
        name: "Testimonials",
        icon: <MdOutlineRateReview />,
        linkName: "/testimonials",
      },
      {
        name: "Projects",
        icon: <CgWebsite />,
        linkName: "/projects",
      },
      // {
      //   name: "About-Us",
      //   icon: <MdInfoOutline />,
      //   linkName: "/about-us",
      // },
      {
        name: "Contact-Us",
        icon: <MdMailOutline />,
        linkName: "/contact-us",
      },
      {
        name: "Terms & Policy",
        icon: <FiLink2 />,
        linkName: "/termpolicy",
      },
    ],
  },
  {
    title: "Personnel",
    links: [
      {
        name: "Admins",
        icon: <RiAdminLine />,
        linkName: "/admins",
      },
      {
        name: "Users",
        icon: <HiOutlineUserGroup />,
        linkName: "/users",
      },
      {
        name: "Sub-Admins",
        icon: <HiOutlineUsers />,
        linkName: "/sub-admins",
      },
    ],
  },
];
