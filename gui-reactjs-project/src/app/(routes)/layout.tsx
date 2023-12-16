'use client';

import Sidebar from "../components/Sidebar";
import classes from "./styles.module.scss";
import SocketService from "@/services/socketService";
import {useEffect} from "react";
import axiosInstance from "@/app/routers/axios";

export default function SidebarLayout({children}: {
  children: React.ReactNode
}) {
  const socketService = SocketService.instance();
  useEffect(() => {
    async function getCourses() {
      const response = await axiosInstance.get("/courses/user/enrolled-courses");
      const {message, data: courses, statusCode} = response.data
      if (statusCode === 200) {
        socketService.subscribeCourses(courses.map(item => (item.id)))
      }
    }
    getCourses();
  }, []);
  return <div className={classes.sidebarLayout}>
    <Sidebar></Sidebar>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}