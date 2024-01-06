import { call, put, takeLatest } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";
import { setMyCourse } from "@/redux/reducers/courses";
import { Course } from "@/models/course";
import axiosInstance from "@/app/routers/axios";
import { AxiosResponse } from "axios";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";

export const getMyCoursesAction = createAction("course/getMyCourse");

function* requestGetMyCourses() {
  try {
    yield put(setLoading(true));
    const response: AxiosResponse = yield call(axiosInstance.get, "/courses/user/my-courses");
    yield put(setMyCourse(response.data.data));
  } catch (e) {
    yield console.log(e);
  } finally {
    yield put(setLoading(false));
  }
}

export function* getMyCourses() {
  yield takeLatest(getMyCoursesAction, requestGetMyCourses);
}
