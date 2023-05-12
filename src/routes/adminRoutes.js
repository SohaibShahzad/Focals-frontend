import { RxDashboard } from "react-icons/rx";
import { MdOutlineArticle, MdTrolley, MdOutlineCases, MdInfoOutline, MdMailOutline, MdOutlineRateReview } from "react-icons/md";
import {HiOutlineUserGroup, HiOutlineUsers} from 'react-icons/hi'
import {RiAdminLine} from 'react-icons/ri'

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
        name: "Portfolio",
        icon: <MdOutlineCases />,
        linkName: "/portfolio",
      },
      {
        name: "Testimonials",
        icon: <MdOutlineRateReview />,
        linkName: "/testimonials",
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
      }
    ],
  },
  {
    title: 'Personnel',
    links: [
      {
        name: 'Admins',
        icon: <RiAdminLine />,
        linkName: "/admins",
      },
      {
        name: 'Users',
        icon: <HiOutlineUserGroup />,
        linkName: "/users",
      },
      // {
        //     name: 'Sub-Admins',
        //     icon: <HiOutlineUsers />
        // }
    ]
  }
];
