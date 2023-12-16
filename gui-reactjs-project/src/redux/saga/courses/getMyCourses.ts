import { call, put, takeLatest } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";
import { setMyCourse } from "@/redux/reducers/courses";
import { Course } from "@/models/course";
import axiosInstance from "@/app/routers/axios";
import { AxiosResponse } from "axios";

export const getMyCoursesAction = createAction("course/getMyCourse");

function* requestGetMyCourses() {
  const response: AxiosResponse = yield call(axiosInstance.get, "/courses/user/my-courses");
  yield put(setMyCourse(response.data.data));
}

export function* getMyCourses() {
  yield takeLatest(getMyCoursesAction, requestGetMyCourses);
}
