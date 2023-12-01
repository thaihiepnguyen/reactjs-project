'use client';
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import EnrolledCoursesItem from "@/app/components/EnrolledCoursesItem";
import AddCourses from "@/app/components/AddCourses";
import EnrollCoursesModal from "@/app/components/AddCourses/EnrollCourseModal";

export default function Page() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getCourses() {
      const response = await axiosInstance.get("/courses/user/enrolled-courses");
      setCourses(response.data.data);
    }
    getCourses();
  }, []);

  return <>
    <EnrollCoursesModal isOpen={isModalOpen} closeModel={() => setIsModalOpen(false)}/>
    <div className={classes.classContainer}>
      {
        courses.map((course, index) => {
          return <EnrolledCoursesItem
            key={index}
            title={course.title}
            description={course.description}
            teacherName={course.teacherName}
            teacherAvatar={course.teacherAvatar}
            lastModify={course.lastModify}
          />
        })
      }
      <AddCourses text={'Enroll a course'} openModel={() => setIsModalOpen(true)}/>
    </div>
  </>
}