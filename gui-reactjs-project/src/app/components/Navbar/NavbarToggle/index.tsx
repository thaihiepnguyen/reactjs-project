import {Avatar} from "@mui/material";
import classes from "./styles.module.scss";
import {useState} from "react";
import {Dropdown} from "@/app/components/Navbar/NavbarToggle/Dropdown";
import {minWidth} from "@mui/system";

export default function NavbarToggle({isClicked, avatar ,userName, onClick}) {
  // const [isClick, setClick] = useState(false);

  return (
    <div className={classes.navbarToggle} onClick={() =>onClick(true)}>
      <span>Hi, {userName}</span>
      <div style={{marginLeft: 10}}>
        {!avatar ? <Avatar>H</Avatar> : <Avatar><img style={{minWidth: 50}} src={`${process.env.API_URL}/${avatar}`} ></img></Avatar> }
        {isClicked && <Dropdown/>}
      </div>
    </div>
  )
}