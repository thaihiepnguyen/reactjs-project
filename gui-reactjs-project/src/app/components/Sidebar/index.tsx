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

const getTranslatedAdminSidebarItems = (t: any) => [
  {
    name: t("Users"),
    href: routes.admin_user,
    icon: <AccountCircleOutlined />,
  },
  {
    name: t("Student Ids Mapping"),
    href: routes.admin_mapping,
    icon: <SettingsOutlined />,
  },
];

const getTranslatedStudentSidebarItems = (t: any) => [
  {
    name: t("Home"),
    href: routes.home,
    icon: <HomeOutlined />,
  },
  {
    name: t("My Courses"),
    href: routes.myCourses,
    icon: <SchoolOutlined />,
  },
  {
    name: t('Enrolled Courses'),
    href: routes.enrolledCourses,
    icon: <MenuBookOutlined />
  },
  {
    name: t("Notifications"),
    href: routes.notifications,
    icon: <NotificationsNoneOutlined />,
  },
  {
    name: t("Edit Profile"),
    href: routes.profile,
    icon: <AccountCircleOutlined />,
  },
  {
    name: t("Settings"),
    href: "/settings",
    icon: <SettingsOutlined />,
  },
];

export default function Sidebar() {
  const { user } = useAppSelector((state) => state.userReducer);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [active, setActive] = useState<number>(0);
  const toggle = () => setSidebarOpen((prev) => !prev);

  const { t } = useTranslation();

  const sidebarItems = useMemo(()=>{
    switch (user?.role?.name) {
      case 'admin':
        return getTranslatedAdminSidebarItems(t);
      case'student':
        return getTranslatedStudentSidebarItems(t);
      case'teacher':
        return getTranslatedStudentSidebarItems(t);
      default:
        return [];
    }
  }, [user, t])

  useEffect(() => {
    setActive(sidebarItems.reduce((acc, cur, index) => {
      if (pathname.includes(cur.href)) acc = index
      return acc;
    }, -1))
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
