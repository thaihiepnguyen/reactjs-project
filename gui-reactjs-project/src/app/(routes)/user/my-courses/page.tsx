'use client';

import CoursesItem from "@/app/components/CoursesItem";
import classes from "./styles.module.scss";
import { use, useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";

export default function Page() {
  const [courses, setCourses] = useState<any[]>([]);
  
  useEffect(() => {
    async function getCourses() {
      const response = await axiosInstance.get("/courses/user/my-courses");
      if(response.data.avatarUrl && !response.data.user.avatarUrl.includes('http')){
        response.data.user.avatarUrl = `${process.env.API_URL}\\${response.data.user.avatarUrl}`
       }
      setCourses(response.data);
    }
    getCourses();
  }, []);


  return <>
    <div className={classes.classContainer}>
      {
        courses.map((course, index) => {
          return <CoursesItem key={index} 
          title={course.title} 
          description={course.description}
          teacherName={course.teacherName}
          teacherAvatar={course.teacherAvatar}
          lastModify={course.lastModify}
          />
        })
      }
    </div>
  </>
}