'use client'

import { useAppSelector } from "@/redux/hook";
import { Box, Button, Stack } from "@mui/material";
import classes from "./styles.module.scss"
import { signIn } from "next-auth/react";

export default function Login() {
  const {value} = useAppSelector(state => state.counterReducer)

  return (
    <>
      <span>Login page</span>
      <span>Counter: {value}</span>
      <Button onClick={()=>signIn('google')}>Login with google</Button>
    </>
  )
}
