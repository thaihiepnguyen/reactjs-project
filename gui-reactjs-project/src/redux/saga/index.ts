import { all } from "redux-saga/effects";
import { getMyCourses } from "./courses/getMyCourses";
import { getEnrolledCourses } from "./courses/getEnrolledCourses";

export default function* rootSaga() {
  yield all([getMyCourses(), getEnrolledCourses()]);
}
