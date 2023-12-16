'use client';

import MyCoursesItem from "../../../components/MyCoursesItem";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import AddCourses from "@/app/components/AddCourses";
import AddCoursesModal from "@/app/components/AddCourses/AddCoursesModal";

export default function Page() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getCourses() {
      const response = await axiosInstance.get("/courses/user/my-courses");
      setCourses(response.data.data);
    }
    getCourses();
  }, []);


  return <>
    <AddCoursesModal isOpen={isModalOpen} closeModel={() => setIsModalOpen(false)}/>
    <div className={classes.classContainer}>
      {
        courses.map((course, index) => {
          return <MyCoursesItem key={index}
          title={course.title}
          description={course.description}
          lastModify={course.lastModify}
          id={course.id}
          isActive={course.isActive}
          />
        })
      }
      <AddCourses text={'Add a course'} openModel={() => setIsModalOpen(true)}/>
    </div>
  </>
}