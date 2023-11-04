'use client'

import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import {Helmet} from "react-helmet"


export default function Login() {
  const {value} = useAppSelector(state => state.counterReducer)
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <span>Login page</span>
      <span>Counter: {value}</span>
    </>
  )
}
