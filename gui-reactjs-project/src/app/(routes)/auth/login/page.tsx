'use client'

import { useAppSelector } from "@/redux/hook";
import { Box, Button, Stack } from "@mui/material";
import classes from "./styles.module.scss"

export default function Login() {
  const {value} = useAppSelector(state => state.counterReducer)

  return (
    <>
      <Button className={classes.button}>Button</Button>
      <span>Login page</span>
      <span>Counter: {value}</span>
    </>
  )
}
