"use client";
import { useEffect } from "react";
import axiosInstance from "@/app/routers/axios";
import { setUser } from "@/redux/reducers/user";
import UserService from "@/services/user";
import { setLoading } from "@/redux/reducers/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";

const ReduxLayer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userReducer);
  const { data: session, status } = useSession();

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

  return <>{children}</>;
};

export default ReduxLayer;
