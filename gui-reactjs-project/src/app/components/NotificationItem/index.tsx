import classes from './styles.module.scss'
import {Avatar} from "@mui/material";


export default function NotificationItem(
  { avatarUrl, userName, title, time, onClick, index }
) {
  return <>
    <div className={classes.notificationItemContainer} onClick={()  => onClick(index)}>
      <div className={classes.avatarContainer}>
        <Avatar>
          <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`${avatarUrl}`}></img>
        </Avatar>
      </div>

      <div className={classes.messageContainer}>
        <h5>{userName}</h5>
        <p>{title}</p>
        <span className={classes.minutes}> {time}</span>
      </div>
    </div>
  </>
}