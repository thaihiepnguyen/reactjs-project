"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";

const JoinCourse = () => {
  const searchParams = useSearchParams();
  const classCode = searchParams.get("code");
  const { user } = useAppSelector((state) => state.userReducer);
  const router = useRouter();

  useEffect(() => {
    if (!user && classCode) {
      localStorage.setItem("classCode", `${classCode}`);
      router.push('/auth/welcome');
    }
    console.log(user, classCode);
    if (user && classCode) {
      axiosInstance
        .post("courses/user/enroll-courses/add", {
          classCode: classCode,
        })
        .then(async (response) => {
          console.log(response);
          if (response.data.statusCode == 201) {
            await Swal.fire({
              title: response.data.message,
              text: "Congratulations!",
              icon: "success",
            }).then(() => {
              router.push(`/course/${response.data.data}`);
            });
          } else {
            await Swal.fire({
              title: response.data.message,
              text: "Please try again!",
              icon: "error",
            }).then(() => {
              if (response.data.data) {
                router.push(`/course/${response.data.data}`);
              } else {
                router.push(user?.role?.name === "teacher" ? `user/my-courses` : "user/enrolled-courses");
              }
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Oops!",
            text: "Please try again!",
            icon: "error",
          }).then(() => {
            router.push(user?.role?.name === "teacher" ? `user/my-courses` : "user/enrolled-courses");
          });
        })
        .finally(() => {
          localStorage.removeItem("classCode");
        })
    }
  }, [user, classCode]);
  return <div></div>;
};

export default JoinCourse;
