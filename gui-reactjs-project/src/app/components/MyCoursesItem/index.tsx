"use client";

import Link from "next/link";
import classes from "./styles.module.scss";
import { AccessTimeFilledOutlined } from "@mui/icons-material";
import { routes } from "@/app/routers/routes";
import React from "react";
import MenuCourses from "@/app/components/MyCoursesItem/MenuCourses";
import { Router } from "react-router-dom";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook";

export default function MyCoursesItem(props) {
  const { title, description, lastModify, id, isActive, teacherIds } = props;
  const {user} = useAppSelector((state) => state.userReducer)
  const router = useRouter();
  function handleClick(e: any) {
    if (!isActive) {
      e.preventDefault(false);
      Swal.fire({
        title: "This course is blocked by admin!",
        text: "Failure!",
        icon: "error",
      });
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <div className={classes.classItem}>
        <div className={classes.className}>
          <div className={classes.titleContainer}>
            <div className={classes.moreVer}>
              <MenuCourses id={id} isOwn={teacherIds?.indexOf(user?.id) === 0} />
            </div>
            <div className={classes.classTitle}>
              <Link href={routes.courseDetail + id} onClick={(e) => handleClick(e)} className={classes.classTitleText}>
                {title}
              </Link>
            </div>
            <div className={classes.classDescription}>
              <span className={classes.classDescriptionText}>{description}</span>
            </div>
          </div>
        </div>
        <div className={classes.classBackground}></div>
        <div className={classes.classInformation}>
          <div className={classes.classDate}>
            <AccessTimeFilledOutlined />
            <span className={classes.classDateText}>Last update at {lastModify}</span>
          </div>
        </div>
      </div>
    </>
  );
}
