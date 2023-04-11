import { RxDashboard } from "react-icons/rx";
import { MdOutlineArticle, MdTrolley, MdOutlineCases, MdInfoOutline, MdMailOutline } from "react-icons/md";
import {HiOutlineUserGroup, HiOutlineUsers} from 'react-icons/hi'
import {RiAdminLine} from 'react-icons/ri'

export const adminLinks = [
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
        name: "Blogs",
        icon: <MdOutlineArticle />,
      },
      {
        name: "Services",
        icon: <MdTrolley />,
      },
      {
        name: "Portfolio",
        icon: <MdOutlineCases />,
      },
      {
        name: "About-Us",
        icon: <MdInfoOutline />,
      },
      {
        name: "Contact-Us",
        icon: <MdMailOutline />,
      }
    ],
  },
  {
    title: 'Personnel',
    links: [
        {
            name: 'Admins',
            icon: <RiAdminLine />
        },
        // {
        //     name: 'Clients',
        //     icon: <HiOutlineUserGroup />
        // },
        // {
        //     name: 'Sub-Admins',
        //     icon: <HiOutlineUsers />
        // }
    ]
  }
];
