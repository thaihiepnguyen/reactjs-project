'use client';

import Link from 'next/link';
import classes from './styles.module.scss';
import { AccessTimeFilledOutlined } from "@mui/icons-material";
import { routes } from '@/app/routers/routes';


export default function CoursesItem() {
  return <>
    <div className={classes.classItem}>
      <div className={classes.className}>
        <img className={classes.classAvt} aria-hidden="true" src="https://lh3.googleusercontent.com/a/default-user=s75-c" data-iml="5098.800000011921">

        </img>
        <div className={classes.titleContainer}>
          <div className={classes.classTitle}>
            <Link href={routes.myCourses} className={classes.classTitleText}>2310-CLC-AWP-20KTPM2</Link>
          </div>
          <div className={classes.classDescription}>
            <span className={classes.classDescriptionText}>Advanced Web Programming</span>
          </div>
          <div className={classes.classTeacher}>
            <Link href={routes.myCourses} className={classes.classTeacherText}>Nguyễn Văn A</Link>
          </div>
        </div>
      </div>
      <div className={classes.classBackground}>

      </div>
      <div className={classes.classInformation}>
        <div className={classes.classDate}>
          <AccessTimeFilledOutlined/>
          <span className={classes.classDateText}>
            27 Feb 2023
          </span>
        </div>
      </div>
    </div>
  </>
}