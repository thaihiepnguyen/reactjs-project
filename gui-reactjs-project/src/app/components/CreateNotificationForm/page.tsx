'use client'
import React, {useState} from 'react';
import classes from './style.module.scss';
import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { Create } from '@mui/icons-material';
import axiosInstance from "@/app/routers/axios";

export default function CreateNotificationForm({onHideForm, id}){
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
      const response = await axiosInstance.post('noti/teacher/push/courses', {
        ...notificationData,
        id
      });
    }

    return (
      <div className={classes.container}>
        <h4>This notification is used for:</h4>
        <br/>
        <Checkbox checked disabled />Notify to all students in class
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
        <TextField
          id="content"
          label=""
          multiline
          rows={6}
          placeholder='Your notification'
          variant="filled"
          style={{width: '100%'}}
          value={notificationData.content}
          onChange={handleChange}
        />
        <br/><br/>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }}>
          <Button 
            variant="contained"
            type="submit"
            >
            Create
          </Button>
          <Button variant="outlined" onClick={onHideForm}>Cancel</Button>
        </Stack>
        </form>
      </div>
    )
}