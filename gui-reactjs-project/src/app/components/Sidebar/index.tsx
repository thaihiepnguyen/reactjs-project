'use client';

import classes from "./styles.module.scss";
import Link from "next/link";
import {HomeOutlined, SettingsOutlined,NotificationsNoneOutlined, ArrowBackIosOutlined, ArrowForwardIosOutlined, AccountCircleOutlined, SchoolOutlined} from '@mui/icons-material';
import { useState } from "react";
import classNames from 'classnames';

const sidebarItems = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeOutlined />
  },
  {
    name: 'My Courses',
    href: '/user/my-courses',
    icon: <SchoolOutlined />
  },
  {
    name: 'Notifications',
    href: '/user/notifications',
    icon: <NotificationsNoneOutlined />
  },
  {
    name: 'Edit Profile',
    href: '/user/profile',
    icon: <AccountCircleOutlined />
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <SettingsOutlined />
  }
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);
  const toggle = () => setSidebarOpen((prev) => !prev);

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