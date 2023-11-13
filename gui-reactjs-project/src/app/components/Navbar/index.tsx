'use client';

import {Avatar, Button} from "@mui/material";
import Link from "next/link";
import {routes} from "@/app/routers/routes";
import classes from "./styles.module.scss";
import {HomeOutlined} from "@mui/icons-material";
import Cookies from "universal-cookie/es6";
import {useEffect, useState} from "react";
import axiosInstance from "@/app/routers/axios";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import userReducer, {setUser} from "@/redux/reducers/user";
import NavbarToggle from "@/app/components/Navbar/NavbarToggle";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const {id, email, avatar, fullname} = useAppSelector(state => state.userReducer);
  useEffect(() => {
    if (!email) {
      axiosInstance.get(`${process.env.API_URL}/user/profile`, {
        withCredentials: true
      }).then((response) => {
        console.log(response.data)
        dispatch(setUser({
          id: response.data.id,
          email: response.data.email,
          avatar: response.data.avatarUrl,
          fullname: response.data.fullname
        }));
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [])


  return (
    <div className={classes.nav}>
      <div>
        <Link href={routes.home} className={classes.home}>
          <HomeOutlined/>
          Home
        </Link>
      </div>
      {
       !email ? <div className={classes.loginContainer}>
        <Button variant="outlined" href={routes.register}>Register</Button>
        <Button variant="outlined" href={routes.login}>Login</Button>
       </div> : <NavbarToggle userName={fullname}/>
      }
    </div>
  )
}