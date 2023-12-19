"use client";

import MyCoursesItem from "../../../components/MyCoursesItem";
import classes from "./styles.module.scss";
import { useState } from "react";
import AddCourses from "@/app/components/AddCourses";
import AddCoursesModal from "@/app/components/AddCourses/AddCoursesModal";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EnrollCoursesModal from "@/app/components/AddCourses/EnrollCourseModal";

export default function Page() {
  const { myCourses: courses } = useAppSelector((state) => state.courseReducer);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [joinCourseModalOpen, setJoinCourseModalOpen] = useState<boolean>(false);
  const router = useRouter();
  return (
    <>
      {isModalOpen ? <AddCoursesModal openJoinModel={() => setJoinCourseModalOpen(true)} closeModel={() => setIsModalOpen(false)} /> : null}
      {joinCourseModalOpen ? <EnrollCoursesModal closeModel={() => setJoinCourseModalOpen(false)} /> : null}

      <div className={classes.classContainer}>
        {courses?.length ? (
          <>
            {courses.map((course, index) => {
              return (
                <MyCoursesItem
                  key={index}
                  title={course.title}
                  description={course.description}
                  lastModify={course.lastModify}
                  id={course.id}
                  isActive={course.isActive}
                  teacherIds={course.teacherIds}
                />
              );
            })}
          </>
        ) : null}

        <AddCourses text={"Add a course"} openModel={() => setIsModalOpen(true)} />
      </div>
    </>
  );
}
