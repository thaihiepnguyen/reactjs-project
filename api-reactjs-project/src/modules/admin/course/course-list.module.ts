import { Module } from "@nestjs/common";
import { CourseListController } from "./course-list.controller";
import { CourseListService } from "./course-list.service";
import { CourseService } from "src/modules/course/course.service";


@Module({
  controllers: [CourseListController],
  providers: [CourseListService, CourseService],
})
export class CourseListModule {}