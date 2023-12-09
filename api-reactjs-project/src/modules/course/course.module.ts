import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { Courses } from "src/typeorm/entity/Courses";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Participants } from "src/typeorm/entity/Participants";


@Module({
  imports: [TypeOrmModule.forFeature([Courses, Participants])],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService]
})
export class CourseModule {}