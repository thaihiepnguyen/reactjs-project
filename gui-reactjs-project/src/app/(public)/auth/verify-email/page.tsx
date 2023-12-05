"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import UserService from "@/services/user";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";

function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (token) {
      dispatch(setLoading(true));
      UserService.activeAccount(token)
        .then((res) => {
          Swal.fire({
            title: "Successs",
            text: "Email activated successfully!",
            icon: "success",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Oops!",
            text: "Email activated fail!",
            icon: "error",
          });
        })
        .finally(() => {
          dispatch(setLoading(false));
          router.push("/auth/welcome");
        });
    } else {
        router.push("/auth/welcome");
    }
  }, [token]);
  return <Container maxWidth="sm"></Container>;
}

export default VerifyEmail;
