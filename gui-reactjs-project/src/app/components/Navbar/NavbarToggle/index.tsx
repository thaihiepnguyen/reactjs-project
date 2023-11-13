import {Avatar} from "@mui/material";
import classes from "./styles.module.scss";
import {useState} from "react";
import {Dropdown} from "@/app/components/Navbar/NavbarToggle/Dropdown";

export default function NavbarToggle({userName}: { userName: string }) {
  const [isClick, setClick] = useState(false);


  return (
    <div className={classes.navbarToggle} onClick={()=> setClick(true)}>
      <span>Hi, {userName}</span>
      <div style={{marginLeft: 10}}><Avatar>H</Avatar>
        {isClick && <Dropdown/>}
      </div>

    </div>
  )
}