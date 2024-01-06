import { Course } from "@/models/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  enrolledCourses: Course[] | null;
  myCourses: Course[] | null;
}

const initialState: CourseState = {
  enrolledCourses: null,
  myCourses: null,
};

const course = createSlice({
  name: "course",
  initialState,
  reducers: {
    setEnrolledCourse: (state, action: PayloadAction<Course[]>) => {
      state.enrolledCourses = action.payload;
    },
    setMyCourse: (state, action: PayloadAction<Course[]>) => {
      state.myCourses = action.payload;
    },
    getMyCourse: () => {
     // do nothing
    },
    getEnrolledCourse: () => {
      // do nothing
     },
  },
});

export const { setEnrolledCourse, setMyCourse, getMyCourse, getEnrolledCourse } = course.actions;

export default course.reducer;
