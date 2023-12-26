'use client';

import classes from './styles.module.scss'
import {useEffect, useState} from "react";
import SocketService, {MESSAGE_TYPE} from "@/services/socketService";
import NotificationItem from "@/app/components/NotificationItem";
import axiosInstance from "@/app/routers/axios";
import parse from 'html-react-parser';
import { useTranslation } from 'next-i18next';
import {getCookie} from "cookies-next";

export default function Page() {
  const socketService = SocketService.instance();
  const [notifications, setNotifications] = useState([]);
  const [notiDetail, setNotiDetail] = useState(0);
  const userId = getCookie('userId');
  const [notiDetail, setNotiDetail] = useState(0)
  const {t} = useTranslation();
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
    if (message.type == MESSAGE_TYPE.COURSES) {
      setNotifications([message.data, ...notifications]);
    }
    if (message.type == MESSAGE_TYPE.SCORES) {
      setNotifications([...message.data[userId], ...notifications]);
    }
  })

  return <>
    <div className={classes.notificationContainer}>
      <div className={classes.listNotification}>
        <h2 style={{marginBottom: 16}}>{t('Notifications')}</h2>
        <div className={classes.list}>
        {
          notifications.map((item, index) => {
            return <div key={index}>
              <NotificationItem
                index={index}
                onClick={setNotiDetail}
                title={item.title}
                avatarUrl={item.avatarUrl}
                userName={item.userName}
                time={item.time}
              />
            </div>
          })
        }
        </div>
      </div>
      <div className={classes.detailNotification}>
        {
          notifications.length && <div dangerouslySetInnerHTML={{
            __html: notifications[notiDetail].message
          }}></div>
        }
      </div>
    </div>
  </>
}