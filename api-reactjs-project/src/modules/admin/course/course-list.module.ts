import { Module } from "@nestjs/common";
import { CourseListController } from "./course-list.controller";
import { CourseListService } from "./course-list.service";
import { CourseService } from "src/modules/course/course.service";
import { CourseModule } from "src/modules/course/course.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Courses } from "src/typeorm/entity/Courses";
import { Participants } from "src/typeorm/entity/Participants";



@Module({
  controllers: [CourseListController],
  providers: [CourseListService, CourseService],
  imports: [TypeOrmModule.forFeature([Courses, Participants])]
})
export class CourseListModule {}