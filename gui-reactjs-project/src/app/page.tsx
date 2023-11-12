"use client"

import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { routes } from "./routers/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { increment, decrease } from "@/redux/reducers/counter";
import API from "@/services/apiConfig"

export default function LandingPage() {
  // const dispatch = useAppDispatch();
  // const {value} = useAppSelector(state=>state.counterReducer);

  // const onClick = () => {
  //   dispatch(decrease(10))
  // }

  return (
    <div style={{width: '100%', height: '100%', textAlign: "center"}}>
      Landing page
    </div>
  );
}
