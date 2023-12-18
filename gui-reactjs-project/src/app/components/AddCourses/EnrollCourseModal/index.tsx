'use client';

import classes from "./styles.module.scss";
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/redux/hook";
import { getEnrolledCourse, getMyCourse } from "@/redux/reducers/courses";

export default function EnrollCoursesModal(props) {
  const { closeModel } = props;
  const dispatch = useAppDispatch();
  const [courseData, setCourseData] = useState({
    classCode: '',
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCourseData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axiosInstance.post('courses/user/enroll-courses/add', courseData);
    closeModel(true);
    if (response.data.statusCode == 201) {
      await Swal.fire({
        title: response.data.message,
        text: 'Congratulations!',
        icon: 'success',
      })
      dispatch(getEnrolledCourse());
      dispatch(getMyCourse());
    } else {
      Swal.fire({
        title: response.data.message,
        text: 'Please try again!',
        icon: 'error',
      })
    }
  };
  return <>
    <div className={classes.overlay} onClick={closeModel}></div>
    <div className={classes.modelContainer}>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h3 style={{ padding: 10 }}>Enroll a course</h3>
        <div>
          <TextField
            id="classCode"
            required
            label="Class Code (Required)"
            margin="normal"
            fullWidth
            value={courseData.classCode}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <Button type="submit" variant="outlined">
            Enroll
          </Button>
        </div>
      </form>
    </div>
  </>
}