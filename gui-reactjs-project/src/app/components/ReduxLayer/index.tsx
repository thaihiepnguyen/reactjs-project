"use client";
import { useEffect } from "react";
import axiosInstance from "@/app/routers/axios";
import { setUser } from "@/redux/reducers/user";
import UserService from "@/services/user";
import { setLoading } from "@/redux/reducers/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { getEnrolledCourse, getMyCourse } from "@/redux/reducers/courses";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ReduxLayer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userReducer);
  const { enrolledCourses, myCourses } = useAppSelector((state) => state.courseReducer);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (!session) {
      dispatch(setLoading(true));
      UserService.getMe()
        .then((data) => {
          dispatch(setUser(data));
        })
        .catch((e) => {
          dispatch(setUser(null));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      if (!user) {
        dispatch(setLoading(true));
        axiosInstance
          .post("/auth/login-social", {
            user: session.user,
          })
          .then((res) => {
            dispatch(setUser(res.data.data.user));
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => dispatch(setLoading(false)));
      }
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      if (!enrolledCourses) {
        dispatch(getEnrolledCourse());
      }
      if (!myCourses) {
        dispatch(getMyCourse());
      }
    }
  }, [user, enrolledCourses, myCourses]);

  useEffect(() => {
    const classCode = localStorage.getItem("classCode");
    if (classCode) {
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
        });
    }
  }, []);
  return <>{children}</>;
};

export default ReduxLayer;
