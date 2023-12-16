'use client';

import Link from 'next/link';
import classes from './styles.module.scss';
import { AccessTimeFilledOutlined } from "@mui/icons-material";
import { routes } from '@/app/routers/routes';
import MenuCourses from "@/app/components/EnrolledCoursesItem/MenuCourses";
import React from "react";


export default function EnrolledCoursesItem(props) {
  const {title, description, teacherName, teacherAvatar, lastModify, id } = props
  return <>
    <div className={classes.classItem}>
      <div className={classes.className}>
        <img className={classes.classAvt} aria-hidden="true" src={teacherAvatar || "https://lh3.googleusercontent.com/a/default-user=s75-c"} data-iml="5098.800000011921" alt={'img'}>

        </img>
        <div className={classes.titleContainer}>
          <div className={classes.moreVer}>
            <MenuCourses id={id}/>
          </div>
          <div className={classes.classTitle}>
            <Link href={routes.myCourses} className={classes.classTitleText}>{title}</Link>
          </div>
          <div className={classes.classDescription}>
            <span className={classes.classDescriptionText}>{description}</span>
          </div>
          <div>
            <Link href={routes.myCourses} className={classes.classTeacherText}>{teacherName}</Link>
          </div>
        </div>
      </div>
      <div className={classes.classBackground}>

      </div>
      <div className={classes.classInformation}>
        <div className={classes.classDate}>
          <AccessTimeFilledOutlined/>
          <span className={classes.classDateText}>
            Last update at {lastModify}
          </span>
        </div>
      </div>
    </div>
  </>
}