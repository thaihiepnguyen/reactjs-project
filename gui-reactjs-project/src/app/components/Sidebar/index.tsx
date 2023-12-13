"use client";

import classes from "./styles.module.scss";
import Link from "next/link";
import { routes } from "@/app/routers/routes";
import {HomeOutlined, SettingsOutlined,NotificationsNoneOutlined, ArrowBackIosOutlined, ArrowForwardIosOutlined, AccountCircleOutlined, SchoolOutlined, MenuBookOutlined} from '@mui/icons-material';
import {useEffect, useMemo, useState} from "react";
import classNames from 'classnames';
import { usePathname } from 'next/navigation'
import { useAppSelector } from "@/redux/hook";
import { useTranslation } from "next-i18next";

const sidebarItems_student = [
  {
    name: "Home",
    href: routes.home,
    icon: <HomeOutlined />,
  },
  {
    name: "My Courses",
    href: routes.myCourses,
    icon: <SchoolOutlined />,
  },
  {
    name: 'Enrolled Courses',
    href: routes.enrolledCourses,
    icon: <MenuBookOutlined />
  },
  {
    name: "Notifications",
    href: routes.notifications,
    icon: <NotificationsNoneOutlined />,
  },
  {
    name: "Edit Profile",
    href: routes.profile,
    icon: <AccountCircleOutlined />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <SettingsOutlined />,
  },
];

const sidebarItems_admin = [
  {
    name: "Users",
    href: routes.admin_user,
    icon: <AccountCircleOutlined />,
  },
  {
    name: "Student Ids Mapping",
    href: routes.admin_mapping,
    icon: <SettingsOutlined />,
  },
];

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.userReducer);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [active, setActive] = useState<number>(0);
  const toggle = () => setSidebarOpen((prev) => !prev);

  const sidebarItems = useMemo(()=>{
    switch (user?.role?.name) {
      case 'admin':
        return sidebarItems_admin;
      case'student':
        return sidebarItems_student;
      case'teacher':
        return sidebarItems_student;
      default:
        return [];
    }
  }, [user])

  useEffect(() => {
    setActive(sidebarItems.reduce((acc, cur, index) => {
      if (pathname.includes(cur.href)) acc = index
      return acc;
    }, 0))
  }, [pathname])

  return <>
    <div className={classes.sidebarWrapper}>
      <button className={classes.sidebarButton} onClick={toggle}>{ sidebarOpen ? <ArrowBackIosOutlined/> : <ArrowForwardIosOutlined/>}</button>
      <aside className={classNames(classes.sidebar, { [classes.toggle]: !sidebarOpen })}>
        <ul className={classes.sidebarList}>
          {
            sidebarItems.map((item, index) => {
              return <li key = {item.name} onClick={() => setActive(index)}>
                <Link href={item.href} className={classNames(classes.sidebarLink, {[classes.active]: (active === index)})}>
                  <div className={classes.sidebarIcon}>
                    {item.icon}
                  </div>
                  <div className={classes.sidebarName}>
                    {item.name}
                  </div>
                </Link>
              </li>
            })
          }
        </ul>
      </aside>
    </div>
  </>
}
