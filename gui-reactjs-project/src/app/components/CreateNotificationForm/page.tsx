'use client'
import React, {useState} from 'react';
import classes from './style.module.scss';
import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { Create } from '@mui/icons-material';
import axiosInstance from "@/app/routers/axios";
import Swal from 'sweetalert2';
import Editor from '../Editor';
import { useTranslation } from 'next-i18next';

export default function CreateNotificationForm({onHideForm, id}){
    const {t} = useTranslation();
    const [notificationData, setNotifictionData] = useState({
      title: '',
      content: ''
    })

    const handleChange = (event) => {
      const { id, value } = event.target;
      setNotifictionData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        await axiosInstance.post('noti/teacher/push/courses', {
          ...notificationData,
          id
        });
        await Swal.fire({
          title: 'Pushed a notification successfully!',
          text: 'Congratulations!',
          icon: 'success',
        });
      } catch (e) {
        console.log(e);
        await Swal.fire({
          title: 'Pushed a notification failed!',
          text: 'Congratulations!',
          icon: 'error',
        });
      }
    }

    return (
      <div className={classes.container}>
        <h4>{t("This notification is used for:")}</h4>
        <br/>
        <Checkbox checked disabled />{t("Notify to all students in class")}
        <br/><br/>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
        >
        <TextField
          id="title"
          label=""
          placeholder='Your title'
          variant="filled"
          style={{width: '100%'}}
          value={notificationData.title}
          onChange={handleChange}
        />
        <br/><br/>
        <Editor value={notificationData.content} onChange={(data) => {
          handleChange({
            target: {
              id: "content",
              value: data
            }
          })
        }}/>
        
        <br/><br/>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }}>
          <Button 
            variant="contained"
            type="submit"
            >
            {t("Create")}
          </Button>
          <Button variant="outlined" onClick={onHideForm}>{t("Cancel")}</Button>
        </Stack>
        </form>
      </div>
    )
}