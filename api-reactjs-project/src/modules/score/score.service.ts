import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { TBaseDto } from "src/app.dto";
import { GradeCompositions } from "src/typeorm/entity/GradeCompositions";
import { Connection, In, Like } from "typeorm";
import { CourseService } from "../course/course.service";
import { ColumnDto, CreateColumnDto } from "./score.dto";
import { Users } from "src/typeorm/entity/Users";
import { Courses } from "src/typeorm/entity/Courses";
import { Participants } from "src/typeorm/entity/Participants";
import { Scores } from "src/typeorm/entity/Scores";
import { ColumnsResponse, Row } from "./score.typing";
import * as xlsx from 'xlsx';

const N_COLUMNS_IGNORE = 2
@Injectable()
export class ScoreService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService,
  ) {}

  /*
  * Create score's columns of a course
  *
  * @param courseId
  * @param columns
  * 
  * Return null
  */
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
        message: 'Maybe the teacher id is incorrect',
        statusCode: 400,
        data: null
      };
  
      if (!isStudentCorrect) return {
        message: 'Maybe the student id is incorrect',
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

  /*
  * Get information of grade composition to generate default excel file.
  *
  * @param id is a course id
  * @param teacherId
  * 
  * Return rows as studentIds, columns as score's columns and fileName
  */
  async getColumns(id: number, teacherId: number): Promise<TBaseDto<ColumnsResponse>> {
    
    const runner = this.connection.createQueryRunner();

    try {
      // step 1: the teacher must be in this id 
      const isTeacherInCourse = await this.courseService.isTeacherInCourse(id, teacherId);
      if (!isTeacherInCourse) {
        return {
          message: 'the teacher id must be in this id',
          statusCode: 400,
          data: null
        }
      }
  
      // step 2: get student ids and columns
  
      const [studentIds, grades] = await Promise.all([
        runner.manager.getRepository(Participants).find({
          select: {
            studentId: true,
          },
          where: {
            courseId: id,
          }
        }),
        runner.manager.getRepository(GradeCompositions).find({
          select: {
            name: true,
          },
          where: {
            courseId: id,
          }
        })
      ]);

      // step 3: Get the names of the students
      const students = await runner.manager.getRepository(Users).find({
        select: {
          id: true,
          fullname: true,
        },
        where: {
          id: In(studentIds.map(item => (item.studentId))),
        }
      });

      return {
        message: 'success',
        statusCode: 200,
        data: {
          rows: students as Row[],
          columns: grades.map(item => (item.name)),
          fileName: `00${id}.xls`
        }
      }
    } catch (e) {
      console.log(e);
    }
    finally {
      await runner.release();
    }
  }

  async saveScores(file: Express.Multer.File, userId: number): Promise<TBaseDto<null>>  {
    const workbook = xlsx.readFile(`uploads/score/${file.filename}`);

    // Step 1: load data from sheets
    let data = [];
    const sheets = workbook.SheetNames;
      
    for(let i = 0; i < sheets.length; i++) { 
      const temp = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]) 
      temp.forEach((res) => {
        data.push(res) 
      });
    }
    // validate data

    // Step 2: save data to db
    
    const valueColumns = Object.keys(data[0]).filter(item => (item != 'id' && item != 'Tên'));
    
    const courseId = +file.filename.split('.')[0];

    const nColumns = Object.keys(data[0]).length - N_COLUMNS_IGNORE;
    const nStudents = data.length;
    let params = '(?, ?, ?, ?)';
    for (let i = 0; i < nColumns - 1; i++) {
      params = params.concat(', ', params);
    }

    for (let i = 0; i < nStudents - 1; i++) {
      params = params.concat(', ', params);
    }

    const index = await this._indexGrade(courseId);

    const sql = `
      INSERT INTO scores (grade_id, student_id, teacher_id, score)
      VALUES
      ${params}
      ON DUPLICATE
        KEY UPDATE
          score = VALUES(score);
    `
    
    const valueParams = data.reduce((acc, cur) => {
      let curScores = [];
      valueColumns.forEach(item => {
        curScores = [...curScores, index[item], cur.id, userId, cur[item]];
      })
      acc = [...acc, ...curScores];
      return acc;
    }, [])
    try {
      await this.connection.getRepository(Scores).query(sql, valueParams);
    } catch(e) {
      return {
        message: e,
        statusCode: 200,
        data: null
      };
    }
    
    return {
      message: 'success',
      statusCode: 200,
      data: null
    };
  }

  private async _indexGrade(courseId: number) {
    const grade = await this.connection.getRepository(GradeCompositions).find({
      select: {
        id: true,
        name: true,
      },
      where: {
        courseId
      }
    });

    return grade.reduce((acc, cur) => {
      acc[cur.name] = cur.id;
      return acc;
    }, {});
  }
}