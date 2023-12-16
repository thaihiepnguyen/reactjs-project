"use client";

import MyCoursesItem from "../../../components/MyCoursesItem";
import classes from "./styles.module.scss";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import AddCourses from "@/app/components/AddCourses";
import AddCoursesModal from "@/app/components/AddCourses/AddCoursesModal";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const { myCourses: courses } = useAppSelector((state) => state.courseReducer);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      {isModalOpen ? <AddCoursesModal closeModel={() => setIsModalOpen(false)} /> : null}
      <div className={classes.classContainer}>
        {courses?.length ? (
          <>
            {courses.map((course, index) => {
              return (
                <Link href={`/course/${course.id}`}>
                  <MyCoursesItem
                    key={index}
                    title={course.title}
                    description={course.description}
                    lastModify={course.lastModify}
                    id={course.id}
                    isActive={course.isActive}
                  />
                </Link>
              );
            })}
          </>
        ) : null}

        <AddCourses text={"Add a course"} openModel={() => setIsModalOpen(true)} />
      </div>
    </>
  );
}
