import { call, put, takeLatest } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";
import { setEnrolledCourse } from "@/redux/reducers/courses";
import { Course } from "@/models/course";
import axiosInstance from "@/app/routers/axios";
import { AxiosResponse } from "axios";

export const getEnrolledCoursesAction = createAction("course/getEnrolledCourse");

function* requestGetEnrolledCourses() {
  const response: AxiosResponse = yield call(axiosInstance.get, "/courses/user/enrolled-courses");

  yield put(setEnrolledCourse(response.data.data));
}

export function* getEnrolledCourses() {
  yield takeLatest(getEnrolledCoursesAction, requestGetEnrolledCourses);
}
