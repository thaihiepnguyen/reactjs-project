import { call, put, takeLatest } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";
import { setEnrolledCourse } from "@/redux/reducers/courses";
import { Course } from "@/models/course";
import axiosInstance from "@/app/routers/axios";
import { AxiosResponse } from "axios";
import { setLoading } from "@/redux/reducers/loading";

export const getEnrolledCoursesAction = createAction("course/getEnrolledCourse");

function* requestGetEnrolledCourses() {
  try {
    yield put(setLoading(true));
    const response: AxiosResponse = yield call(axiosInstance.get, "/courses/user/enrolled-courses");
    yield put(setEnrolledCourse(response.data.data));
  } catch (e) {
    yield console.log(e);
  } finally {
    yield put(setLoading(false));
  }

 
}

export function* getEnrolledCourses() {
  yield takeLatest(getEnrolledCoursesAction, requestGetEnrolledCourses);
}
