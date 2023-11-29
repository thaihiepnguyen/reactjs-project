'use client';

import Link from 'next/link';
import classes from './styles.module.scss';
import { AccessTimeFilledOutlined } from "@mui/icons-material";
import { routes } from '@/app/routers/routes';


export default function CoursesItem(props) {
  const {title, description, teacherName, teacherAvatar, lastModify } = props
  return <>
    <div className={classes.classItem}>
      <div className={classes.className}>
        <img className={classes.classAvt} aria-hidden="true" src={teacherAvatar || "https://lh3.googleusercontent.com/a/default-user=s75-c"} data-iml="5098.800000011921">

        </img>
        <div className={classes.titleContainer}>
          <div className={classes.classTitle}>
            <Link href={routes.myCourses} className={classes.classTitleText}>{title}</Link>
          </div>
          <div className={classes.classDescription}>
            <span className={classes.classDescriptionText}>{description}</span>
          </div>
          <div className={classes.classTeacher}>
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
            {lastModify}
          </span>
        </div>
      </div>
    </div>
  </>
}