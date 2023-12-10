'use client'
import React, {useState} from 'react';
import classes from './styles.module.scss';
import MenuListComposition from '@/app/components/MenuListComposition/page';
import { Button } from '@mui/material';
import CreateNotificationForm from '@/app/components/CreateNotificationForm/page';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/router'

export default function Page({ params }: { params: { id: string } }){
  const [showTable, setShowTable] = useState(false);
  const handleClickCreationDiv = () => {
    setShowTable(!showTable);
  }

  return(
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <img className={classes.backgroundImgContainer} aria-hidden="true" src="https://gstatic.com/classroom/themes/img_learnlanguage.jpg" data-iml="5098.800000011921" />
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
        <div className={classes.rightSection}>
          {!showTable &&
            <div
              className={classes.createNotificationDiv}
              onClick={handleClickCreationDiv}
            >
              <p>Create notification for the class</p>
              <AddCircleOutlineIcon />
            </div>
          }
          {showTable && <CreateNotificationForm onHideForm={handleClickCreationDiv} /> }
        </div>
      </div>
    </div>
  )
}
