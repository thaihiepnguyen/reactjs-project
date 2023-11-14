"use client";

import { Avatar, Button } from "@mui/material";
import Link from "next/link";
import { routes } from "@/app/routers/routes";
import classes from "./styles.module.scss";
import { HomeOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import { setUser } from "@/redux/reducers/user";
import UserService from "@/services/user";
import { setLoading } from "@/redux/reducers/loading";
import NavbarToggle from "@/app/components/Navbar/NavbarToggle";
import OutsideClickHandler from "react-outside-click-handler/esm/OutsideClickHandler";
import { useSession } from "next-auth/react"

export default function Navbar() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.userReducer);
  const [isClick, setClick] = useState(false);
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!session) {
      dispatch(setLoading(true));
    UserService.getMe()
      .then((data) => {
        dispatch(
          setUser(data)
        );
      })
      .catch((e) => {
        dispatch(setUser(null));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    } else {
      axiosInstance.post('/auth/login-social', {
        user: session.user
      })
      .then((res)=>{
        dispatch(
          setUser(res.data.data.user)
        );
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [session]);

  return (
    <nav className={classes.nav}>
      {/*<Button variant="outlined" onClick={onClick}>Redux counter reducer: {value}</Button>*/}
      <div>
        <Link href={routes.home} className={classes.home}>
          <HomeOutlined />
          Home
        </Link>
      </div>
      {
        !user ?
        <div className={classes.loginContainer}>
        <Link className={classes.link} href={routes.register}>
          <Button variant="outlined">Register</Button>
        </Link>
        <Link className={classes.link} href={routes.login}>
          <Button variant="outlined">Login</Button>
        </Link>
        </div> : <OutsideClickHandler onOutsideClick={() => setClick(false)}>
            <NavbarToggle isClicked={isClick} avatar={user.avatarUrl} userName={user.fullname} onClick={(isClick) => setClick(isClick)}></NavbarToggle></OutsideClickHandler>
      }
    </nav>
  );
}
