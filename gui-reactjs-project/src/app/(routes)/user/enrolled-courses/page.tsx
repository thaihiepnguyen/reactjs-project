"use client";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import EnrolledCoursesItem from "@/app/components/EnrolledCoursesItem";
import AddCourses from "@/app/components/AddCourses";
import EnrollCoursesModal from "@/app/components/AddCourses/EnrollCourseModal";
import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { enrolledCourses: courses } = useAppSelector((state) => state.courseReducer);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      {isModalOpen ? <EnrollCoursesModal closeModel={() => setIsModalOpen(false)} /> : null}
      <div className={classes.classContainer}>
        {courses?.length ? (
          <>
            {courses.map((course, index) => {
              return (
                <EnrolledCoursesItem
                  key={index}
                  title={course.title}
                  description={course.description}
                  teacherName={course.teacherName}
                  teacherAvatar={course.teacherAvatar}
                  lastModify={course.lastModify}
                  id={course.id}
                />
              );
            })}
          </>
        ) : null}
        <AddCourses text={"Enroll a course"} openModel={() => setIsModalOpen(true)} />
      </div>
    </>
  );
}
