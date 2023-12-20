import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { TBaseDto } from "src/app.dto";
import { GradeCompositions } from "src/typeorm/entity/GradeCompositions";
import { Connection, Like } from "typeorm";
import { CourseService } from "../course/course.service";
import { ColumnDto, CreateColumnDto } from "./score.dto";
import { Users } from "src/typeorm/entity/Users";
import { Courses } from "src/typeorm/entity/Courses";
import { Participants } from "src/typeorm/entity/Participants";
import { Scores } from "src/typeorm/entity/Scores";


@Injectable()
export class ScoreService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService,
  ) {}

  async createColumns(courseId: number, columns: ColumnDto[]): Promise<TBaseDto<null>> {
    if (!this.courseService.isCourseExist(courseId)) {
      return {
        message: 'The course is not existed',
        statusCode: 400,
        data: null
      };
    }

    try {
      await this.connection.getRepository(GradeCompositions).createQueryBuilder()
      .insert()
      .into(GradeCompositions)
      .values(columns.map(item => {
        return {
          courseId: courseId,
          name: item.name,
          scale: item.scale
        }
      }))
      .execute();

      return {
        message: 'success',
        statusCode: 200,
        data: null
      }
    } catch (e) {
      return {
        message: e,
        statusCode: 400,
        data: null
      }
    }
  }

  async addScore(gradeId: number, studentId: number, teacherId: number, score: number)
    : Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();

    try {
      // validate
      const grade = await runner.manager.getRepository(GradeCompositions).findOne(
        { 
          where: { id: gradeId },
          select: {
            courseId: true,
          }
        },
      );
      if (!grade || !Object.keys(grade).length) {
        return {
          message: 'Maybe the grade id is not existed',
          statusCode: 400,
          data: null
        }
      }
      const { courseId } = grade;
  
      const [isTeacherCorrect, isStudentCorrect] = await Promise.all([
        runner.manager.getRepository(Courses).exist({ 
          where: {
            id: courseId,
            teacherIds: Like(`%${teacherId}`),
          }
          }),
        runner.manager.getRepository(Participants).exist({
          where: {
            courseId: courseId,
            studentId: studentId
          }
        })
      ]);
      if (!isTeacherCorrect) return {
        message: 'Maybe the teacher id is not correct',
        statusCode: 400,
        data: null
      };
  
      if (!isStudentCorrect) return {
        message: 'Maybe the student id is not correct',
        statusCode: 400,
        data: null
      };

      // insert 
      await runner.manager.getRepository(Scores).insert({
          gradeId,
          studentId,
          teacherId,
          score
        }
      )
    }
    finally {
      await runner.release();
    }
  }
}