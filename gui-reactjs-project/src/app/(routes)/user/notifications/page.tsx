'use client';

import classes from './styles.module.scss'
import {useEffect, useState} from "react";
import SocketService from "@/services/socketService";
import NotificationItem from "@/app/components/NotificationItem";
import axiosInstance from "@/app/routers/axios";

export default function Page() {
  const socketService = SocketService.instance();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    async function getNotis() {
      const response = await axiosInstance.get('/noti/student');
      if (response.data.statusCode === 200) {
        setNotifications([...notifications, ...response.data.data])
      }
    }
    getNotis()
  }, [])

  socketService.listenCourses((message) => {
    setNotifications([message, ...notifications])
  })

  return <>
    <div className={classes.notificationContainer}>
      <div className={classes.listNotification}>
        <h2 style={{marginBottom: 16}}>{`Notifications`}</h2>
        {
          notifications.map((item, index) => {
            return <div key={index}>
              <NotificationItem
                title={item.title}
                message={item.message}
                avatarUrl={item.avatarUrl}
                userName={item.userName}
                time={item.time}
              />
            </div>
          })
        }
      </div>
      <div className={classes.detailNotification}>

      </div>
    </div>
  </>
}