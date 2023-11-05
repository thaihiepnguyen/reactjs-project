"use client"

import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { routes } from "./routers/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { increment, decrease } from "@/redux/reducers/counter";
import API from "@/services/apiConfig"

export default function Home() {
  const dispatch = useAppDispatch();
  const {value} = useAppSelector(state=>state.counterReducer);

  const onClick = () => {
    dispatch(decrease(10))
  }

  return (
    <Box>
      <Stack direction={"column"} spacing={2}>
        <Button variant="outlined" onClick={onClick}>Redux counter reducer: {value}</Button>
        <Link href={routes.register}>Register</Link>
        <Link href={routes.login}>Login</Link>
      </Stack>
    </Box>
  );
}
