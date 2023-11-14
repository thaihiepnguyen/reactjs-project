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
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/reducers/user";
import UserService from "@/services/user";

export default function Navbar() {
  const cookies = new Cookies();
  const userId = cookies.get('userId');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      UserService.getMe()
        .then(data => {
          dispatch(setUser({
            fullname: data.fullname,
            avatar: data.avatarUrl,
            phone: data.phone,
            email: data.email,
          }))
        })
        .catch(e => {
          dispatch(setUser(null))
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
          <Button variant="outlined"><Link className={classes.link} href={routes.register}>Register</Link></Button>
          <Button variant="outlined" ><Link className={classes.link} href={routes.login}>Login</Link></Button>
      </div>
    </nav>
  )
}