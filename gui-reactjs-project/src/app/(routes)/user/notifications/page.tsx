'use client';

import classes from './styles.module.scss'
import {useState} from "react";
import SocketService from "@/services/socketService";
import NotificationItem from "@/app/components/NotificationItem";

export default function Page() {
  const socketService = SocketService.instance();
  const [notifications, setNotifications] = useState([]);
  socketService.listenCourses((message) => {
    setNotifications([message, ...notifications])
  })

  return <>
    <div className={classes.notificationContainer}>
      <div className={classes.listNotification}>
        <h3 style={{marginBottom: 20}}>{`Notifications`}</h3>
        {
          notifications.map((item, index) => {
            return <div key={index}>
              <NotificationItem
                message={item.message}
                avatarUrl={item.avatarUrl}
                userName={item.userName}
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