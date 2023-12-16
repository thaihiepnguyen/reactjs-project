"use client";
import React, { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import MenuListComposition from "@/app/components/MenuListComposition/page";
import { Button } from "@mui/material";
import CreateNotificationForm from "@/app/components/CreateNotificationForm/page";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axiosInstance from "@/app/routers/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";

export default function Page({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showTable, setShowTable] = useState(false);
  const [course, setCourse] = useState({});
  const handleClickCreationDiv = () => {
    setShowTable(!showTable);
  };

  useEffect(() => {
    function getCourseDetail(id) {
      dispatch(setLoading(true));
      axiosInstance
        .get(`/courses/user/my-courses/detail/${id}`)
        .then((response) => {
          setCourse(response.data.data);
        })
        .catch((err) => {
          Swal.fire({
            title: "Course Not Found",
            icon: "error",
          }).then(() => {
            router.back();
          });
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }

    getCourseDetail(params.id);
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <img
          className={classes.backgroundImgContainer}
          aria-hidden="true"
          src="https://gstatic.com/classroom/themes/img_learnlanguage.jpg"
          data-iml="5098.800000011921"
        />
        <div className={classes.titleCourse}>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </div>
      <br />
      <br />
      <div className={classes.mainContainer}>
        <div className={classes.leftSection}>
          <div className={classes.codeCourse}>
            <div className={classes.boxClassCourseTitle}>
              <h3>Class Code</h3>
              <MenuListComposition />
            </div>
            <br />
            <h4 className={classes.code}>{course.classCode}</h4>
          </div>
          <br />
          <div className={classes.deadline}>
            <h3>Deadline</h3>
            <br />
            <p style={{ color: "rgba(0,0,0,.549)" }}>There is no deadline</p>
            <br />
            <Button variant="text">View excercises</Button>
          </div>
        </div>
        <div className={classes.rightSection}>
          {!showTable && (
            <div className={classes.createNotificationDiv} onClick={handleClickCreationDiv}>
              <p>Create notification for the class</p>
              <AddCircleOutlineIcon />
            </div>
          )}
          {showTable && <CreateNotificationForm onHideForm={handleClickCreationDiv} id={params.id} />}
        </div>
      </div>
    </div>
  );
}
