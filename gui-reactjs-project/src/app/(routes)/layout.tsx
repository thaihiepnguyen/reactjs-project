'use client';

import Sidebar from "../components/Sidebar";
import classes from "./styles.module.scss";
import SocketService from "@/services/socketService";
import {useEffect} from "react";
import axiosInstance from "@/app/routers/axios";
import {getCookie} from "cookies-next";
import {useAppSelector} from "@/redux/hook";

const ROLE = {
  STUDENT: 1,
  TEACHER: 2,
}

export default function SidebarLayout({children}: {
  children: React.ReactNode
}) {
  const { user } = useAppSelector((state) => state.userReducer);
  const socketService = SocketService.instance();
  useEffect(() => {
    async function getEnrollCourses() {
      const response = await axiosInstance.get("/courses/user/enrolled-courses");
      const {message, data: courses, statusCode} = response.data
      if (statusCode === 200) {
        socketService.subscribeCourses(courses.map(item => (item.id)), user.id)
      }
    }
    async function getMyCourses() {
      const response = await axiosInstance.get("/courses/user/my-courses");
      const {message, data: courses, statusCode} = response.data
      if (statusCode === 200) {
        socketService.subscribeCourses(courses.map(item => (item.id)), user.id)
      }
    }
    if (user?.role?.name === "student") {
      getEnrollCourses();
    }
    if (user?.role?.name === "teacher") {
      getMyCourses();
    }
  }, []);
  return <div className={classes.sidebarLayout}>
    <Sidebar></Sidebar>
    <div className={classes.content}>
      {children}
    </div>
  </div>
}