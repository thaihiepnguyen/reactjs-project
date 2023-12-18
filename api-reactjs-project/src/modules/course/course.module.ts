import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { Courses } from "src/typeorm/entity/Courses";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Participants } from "src/typeorm/entity/Participants";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";


@Module({
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
  imports: [AuthModule]
})
export class CourseModule {}