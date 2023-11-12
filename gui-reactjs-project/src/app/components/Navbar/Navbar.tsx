'use client';

import {Avatar, Button} from "@mui/material";
import Link from "next/link";
import {routes} from "@/app/routers/routes";
import classes from "./styles.module.scss";
import {HomeOutlined} from "@mui/icons-material";
import Cookies from "universal-cookie/es6";
import {useEffect, useState} from "react";
import axiosInstance from "@/app/routers/axios";
import axios from "axios";

export default function Navbar() {
  const cookies = new Cookies();
  const userId = cookies.get('userId');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      axiosInstance.get(`${process.env.API_URL}/user/profile`, {
        withCredentials: true
      }).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [])


  return (
    <nav className={classes.nav}>
      {/*<Button variant="outlined" onClick={onClick}>Redux counter reducer: {value}</Button>*/}
      <div>
        <Link href={routes.home} className={classes.home}>
          <HomeOutlined/>
          Home
        </Link>
      </div>
      <div className={classes.loginContainer}>
        <Button variant="outlined" href={routes.register}>Register</Button>
        <Button variant="outlined" href={routes.login}>Login</Button>
      </div>
    </nav>
  )
}