'use client'
import React, {useState} from 'react';
import classes from './style.module.scss';
import MenuListComposition from '@/app/components/MenuListComposition/page';
import { Button } from '@mui/material';
export default function DetailCourse(){
    return(
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <img className={classes.backgroundImgContainer} aria-hidden="true" src="https://edtechframework.com/wp-content/uploads/2021/03/03-March-google-classroom-banner-rainbow-and-clouds-01.png" data-iml="5098.800000011921" />
        <h1 className={classes.titleCourse}>ABC Classroom</h1>
      </div>
      <br/><br/>
      <div className={classes.mainContainer}>
        <div className={classes.leftSection}>
          <div className={classes.codeCourse}>
            <div className={classes.boxClassCourseTitle}>
              <h3>Class Code</h3>
              <MenuListComposition />
            </div>
            <br/>
            <h4 className={classes.code}>nupww3tx</h4>
          </div>
          <br/>
          <div className={classes.deadline}>
            <h3>Deadline</h3>
            <br/>
            <p style={{color: 'rgba(0,0,0,.549)'}}>There is no deadline</p>
            <br/>
            <Button variant="text">View excercises</Button>
          </div>
        </div>
      </div>
    </div>
    )
}
