import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { TBaseDto } from "src/app.dto";
import { GradeCompositions } from "src/typeorm/entity/GradeCompositions";
import { Connection } from "typeorm";
import { CourseService } from "../course/course.service";
import { Courses } from "src/typeorm/entity/Courses";


@Injectable()
export class ScoreService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService,
  ) {}

  async createColumn(courseId: number, name: string, scale: number): Promise<TBaseDto<any>> {
    if (!this.courseService.isCourseExist(courseId)) {
      return {
        message: 'The course is not existed',
        statusCode: 400,
        data: null
      };
    }

    try {
      await this.connection.getRepository(GradeCompositions).insert({
        courseId,
        name,
        scale
      })

      return {
        message: 'success',
        statusCode: 200,
        data: null,
      }
    } catch (e) {
      return {
        message: e,
        statusCode: 400,
        data: null
      };
    }
  }
}