"use client"

import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { routes } from "./routers/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { increment } from "@/redux/reducers/counter";

export default function Home() {
  const dispatch = useAppDispatch();
  const {value} = useAppSelector(state=>state.counterReducer);

  const onClick = () => {
    dispatch(increment(1))
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
