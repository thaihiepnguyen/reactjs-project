import CoursesItem from "@/app/components/CoursesItem";
import classes from "./styles.module.scss";

export default function Page() {
  return <>
    <div className={classes.classContainer}>
    <CoursesItem/>
    <CoursesItem/>
    <CoursesItem/>
    </div>
  </>
}