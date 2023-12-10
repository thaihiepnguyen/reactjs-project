import classes from './styles.module.scss'
import {Avatar} from "@mui/material";


export default function NotificationItem(
  { avatarUrl, userName, title, time }
) {
  return <>
    <div className={classes.notificationItemContainer}>
      <div className={classes.avatarContainer}>
        <Avatar>
          <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`${avatarUrl}`}></img>
        </Avatar>
      </div>

      <div className={classes.messageContainer}>
        <h5>{userName}</h5>
        <p>{title}</p>
        <span className={classes.minutes}> {time === 0 ? 'a new message' : `${time} minutes ago`}</span>
      </div>
    </div>
  </>
}