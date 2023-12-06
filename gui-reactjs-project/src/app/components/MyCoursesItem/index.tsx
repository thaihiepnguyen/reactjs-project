'use client';

import Link from 'next/link';
import classes from './styles.module.scss';
import { AccessTimeFilledOutlined } from "@mui/icons-material";
import { routes } from '@/app/routers/routes';
import React from "react";
import MenuCourses from "@/app/components/MyCoursesItem/MenuCourses";


export default function MyCoursesItem(props) {
  const {title, description, lastModify, id } = props
  return <>
    <div className={classes.classItem}>
      <div className={classes.className}>
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