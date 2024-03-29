'use client';

import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/redux/hook";
import { getMyCourse } from "@/redux/reducers/courses";
import { useTranslation } from "next-i18next";

export default function AddCoursesModal(props: any) {
  const { closeModel, openJoinModel } = props;
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    classCode: '',
  });
  
  const handleChange = (event: any) => {
    const { id, value } = event.target;
    setCourseData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let response
    try {
      response = await axiosInstance.post('courses/user/my-courses/add', courseData);
      closeModel(true);
      if (response.data.statusCode == 201) {
        await Swal.fire({
          title: response.data.message,
          text: 'Congratulations!',
          icon: 'success',
        })
        dispatch(getMyCourse());
      } else {
        Swal.fire({
          title: response.data.message,
          text: 'Please try again!',
          icon: 'error',
        })
      }
    }
    catch (e) {
      await Swal.fire({
        title: "Only teacher can create a course",
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
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h3 style={{ padding: 10 }}>{t('Add a course')}</h3>
          <Button onClick={() => {
              closeModel();
              openJoinModel();
              }} variant="outlined" color="success" style={{marginLeft: 10}}>
              {t('Join as a tutor')}
          </Button>
        </div>

        <div>
          <TextField
            required
            id="name"
            label={t("Name (Required)")}
            margin="normal"
            fullWidth
            value={courseData.name}
            onChange={handleChange}
          />
          <TextField
            required
            id="description"
            label={t("Description (Required)")}
            margin="normal"
            fullWidth
            value={courseData.description}
            onChange={handleChange}
          />
          <TextField
            id="classCode"
            label={t("Class Code (Optional)")}
            margin="normal"
            fullWidth
            value={courseData.classCode}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <Button type="submit" variant="outlined">
            {t('Add')}
          </Button>
        </div>
      </form>
    </div>
  </>
}