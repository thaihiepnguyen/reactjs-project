import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { TBaseDto } from 'src/app.dto';
import { GradeCompositions } from 'src/typeorm/entity/GradeCompositions';
import { Connection, In, IsNull, Like, Not } from 'typeorm';
import { CourseService } from '../course/course.service';
import {
  AddScoreByStudentCodeDto,
  ColumnDto,
  CreateColumnDto,
  CreateUpdateColumnDto,
  DeleteScoreByStudentCodeDto,
  TScore,
} from './score.dto';
import { Users } from 'src/typeorm/entity/Users';
import { Courses } from 'src/typeorm/entity/Courses';
import { Participants } from 'src/typeorm/entity/Participants';
import { Scores } from 'src/typeorm/entity/Scores';
import { ColumnsResponse, Row } from './score.typing';
import * as xlsx from 'xlsx';

const N_COLUMNS_IGNORE = 2;
const COLUMN_ID = 'studentId';
const COLUMN_FULLNAME = 'fullname';
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
  async createColumns(
    courseId: number,
    columns: ColumnDto[],
  ): Promise<TBaseDto<null>> {
    if (!this.courseService.isCourseExist(courseId)) {
      return {
        message: 'The course is not existed',
        statusCode: 400,
        data: null,
      };
    }

    try {
      await this.connection
        .getRepository(GradeCompositions)
        .createQueryBuilder()
        .insert()
        .into(GradeCompositions)
        .values(
          columns.map((item) => {
            return {
              courseId: courseId,
              name: item.name,
              scale: item.scale,
            };
          }),
        )
        .execute();

      return {
        message: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (e) {
      return {
        message: e,
        statusCode: 400,
        data: null,
      };
    }
  }

  /*
   * WARNING: THIS FUNCTION CURRENTLY IS NOT OK!
   * Add a score based on student id.
   *
   * @param gradeId
   * @param studentId
   * @param teacherId
   * @param score
   *
   * Return null
   */
  async addScoreByStudentId(
    gradeId: number,
    studentId: number,
    teacherId: number,
    score: number,
  ): Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();

    try {
      // validate
      const grade = await runner.manager
        .getRepository(GradeCompositions)
        .findOne({
          where: { id: gradeId },
          select: {
            courseId: true,
          },
        });
      if (!grade || !Object.keys(grade).length) {
        return {
          message: 'Maybe the grade id is not existed',
          statusCode: 400,
          data: null,
        };
      }
      const { courseId } = grade;

      const [isTeacherCorrect, isStudentCorrect] = await Promise.all([
        runner.manager.getRepository(Courses).exist({
          where: {
            id: courseId,
            teacherIds: Like(`%${teacherId}`),
          },
        }),
        runner.manager.getRepository(Participants).exist({
          where: {
            courseId: courseId,
            studentId: studentId,
          },
        }),
      ]);
      if (!isTeacherCorrect)
        return {
          message: 'Maybe the teacher id is incorrect',
          statusCode: 400,
          data: null,
        };

      if (!isStudentCorrect)
        return {
          message: 'Maybe the student id is incorrect',
          statusCode: 400,
          data: null,
        };

      const { studentId: studentCode } = await runner.manager
        .getRepository(Users)
        .findOne({ select: { studentId: true }, where: { id: studentId } });
      // insert
      await runner.manager.getRepository(Scores).insert({
        gradeId,
        studentId: studentCode,
        teacherId,
        score,
      });
    } finally {
      await runner.release();
    }
  }
  /*
   * Add a score based on student code (MSSV).
   *
   * @param gradeId
   * @param studentId
   * @param teacherId
   * @param score
   *
   * Return null
   */
  async addScoreByStudentCode(
    studentCode: string,
    teacherId: number,
    scores: TScore,
    courseId: number,
    oldStudentId: string,
  ): Promise<TBaseDto<any>> {
    const runner = this.connection.createQueryRunner();
    try {
      if (oldStudentId) {
        const deleteScore = await runner.manager
          .getRepository(Scores)
          .createQueryBuilder('scores')
          .leftJoinAndSelect(
            GradeCompositions,
            'grade',
            'grade.id = scores.grade_id',
          )
          .where('student_id = :oldStudentId and course_id = :courseId', {
            oldStudentId,
            courseId,
          })
          .getMany()
          .then((scores) => {
            return runner.connection.getRepository(Scores).remove(scores);
          });
      }
      // Step 1: The teacher is correct
      const isTeacherCorrect = await this.courseService.isTeacherInCourse(
        courseId,
        teacherId,
      );
      if (!isTeacherCorrect) {
        return {
          message: 'The teacher id is invalid',
          statusCode: 400,
          data: null,
        };
      }
      // Step 2: validate scores
      if (!scores || !Object.keys(scores).length) {
        return {
          message: 'The scores are invalid',
          statusCode: 400,
          data: null,
        };
      }

      // insert on duplicate
      let params = '(?, ?, ?, ?)';
      for (let i = 0; i < Object.keys(scores).length - 1; i++) {
        params = params.concat(', ', '(?, ?, ?, ?)');
      }

      const index = await this._indexGrade(courseId);

      const sql = `
        INSERT INTO scores (grade_id, student_id, teacher_id, score)
        VALUES
        ${params}
        ON DUPLICATE
          KEY UPDATE
            score = VALUES(score);
      `;

      // warning: if the column which posted doesn't match to db, the default score is 0.
      const valueParams = Object.keys(scores).reduce((acc, cur) => {
        acc = [...acc, index[cur] || 0, studentCode, teacherId, scores[cur]];
        return acc;
      }, []);

      await runner.manager.getRepository(Scores).query(sql, valueParams);

      const scoresList = await runner.manager
        .getRepository(Scores)
        .createQueryBuilder('scores')
        .where('scores.grade_id IN (:...gradeIds)', {
          gradeIds: Object.values(index),
        })
        .leftJoinAndSelect(
          GradeCompositions,
          'grade',
          'grade.id = scores.grade_id',
        )
        .leftJoinAndSelect(
          Users,
          'users',
          'users.student_id = scores.student_id',
        )
        .execute();

      const scoreStudentIds = [
        ...new Set(scoresList.map((score) => score.scores_student_id)),
      ];
      const scoreData = scoreStudentIds.map((studentId: string) => {
        const scoreObj: any = {};
        let avg: number = 0;
        scoresList
          ?.filter((s) => s.scores_student_id === studentId)
          ?.forEach((score) => {
            (scoreObj.fullname = score.users_fullname ?? ''),
              (scoreObj[score.grade_name] = score.scores_score);
            avg += (score.scores_score * score.grade_scale) / 100;
          });
        return {
          studentId: studentId,
          ...scoreObj,
          avg: avg.toFixed(2),
        };
      });

      return {
        message: 'success',
        statusCode: 200,
        data: scoreData,
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'Internal Error!',
        statusCode: 400,
        data: null,
      };
    } finally {
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
  async getColumns(
    id: number,
    teacherId: number,
  ): Promise<TBaseDto<ColumnsResponse>> {
    const runner = this.connection.createQueryRunner();

    try {
      // step 1: The teacher must be in this id
      const isTeacherInCourse = await this.courseService.isTeacherInCourse(
        id,
        teacherId,
      );
      if (!isTeacherInCourse) {
        return {
          message: 'the teacher id must be in this id',
          statusCode: 400,
          data: null,
        };
      }

      // step 2: Get student ids and columns

      const [studentIds, grades] = await Promise.all([
        runner.manager.getRepository(Participants).find({
          select: {
            studentId: true,
          },
          where: {
            courseId: id,
          },
        }),
        runner.manager.getRepository(GradeCompositions).find({
          where: {
            courseId: id,
          },
          order: {
            order: 'ASC',
          },
        }),
      ]);

      if (!grades || !grades.length) {
        return {
          message: 'No grades existed',
          statusCode: 400,
          data: null,
        };
      }

      // step 3: Get names and studentId of the students
      const students = await runner.manager.getRepository(Users).find({
        select: {
          studentId: true,
          fullname: true,
        },
        where: {
          id: In(studentIds.map((item) => item.studentId)),
          studentId: Not(IsNull()),
        },
      });

      const gradeIds = grades.map((grade) => grade.id);
      const scores = await runner.manager
        .getRepository(Scores)
        .createQueryBuilder('scores')
        .where('scores.grade_id IN (:...gradeIds)', { gradeIds })
        .leftJoinAndSelect(
          GradeCompositions,
          'grade',
          'grade.id = scores.grade_id',
        )
        .leftJoinAndSelect(
          Users,
          'users',
          'users.student_id = scores.student_id',
        )
        .execute();

      const scoreStudentIds = [
        ...new Set(scores.map((score) => score.scores_student_id)),
      ];
      console.log(scores)
      const scoreData = scoreStudentIds.map((studentId: string) => {
        const scoreObj: any = {};
        let avg: number = 0;

        scores
          ?.filter((s) => s.scores_student_id === studentId)
          ?.forEach((score) => {
            (scoreObj.fullname = score.users_fullname ?? ''),
              (scoreObj[score.grade_name] = score.scores_score);
            avg += (score.scores_score * score.grade_scale) / 100; 
          });
        return {
          studentId: studentId,
          ...scoreObj,
          avg: avg.toFixed(2),
        };
      });

      return {
        message: 'success',
        statusCode: 200,
        data: {
          rows: students as Row[],
          columns: [
            COLUMN_ID,
            COLUMN_FULLNAME,
            ...grades.map((item) => item.name),
          ],
          scales: grades.map((item) => item.scale),
          grade: grades,
          scores: scoreData,
          fileName: `00${id}.xls`,
        },
      };
    } catch (e) {
      console.log(e);
    } finally {
      await runner.release();
    }
  }

  async saveScores(
    file: Express.Multer.File,
    userId: number,
  ): Promise<TBaseDto<null>> {
    const workbook = xlsx.readFile(`uploads/score/${file.filename}`);

    // Step 1: load data from sheets
    let data = [];
    const sheets = workbook.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
      const temp = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[i]],
      );
      temp.forEach((res) => {
        data.push(res);
      });
    }
    // validate data

    // Step 2: save data to db

    const valueColumns = Object.keys(data[0]).filter(
      (item) => item != COLUMN_ID && item != COLUMN_FULLNAME,
    );

    const courseId = +file.filename.split('.')[0];

    const nColumns = Object.keys(data[0]).length - N_COLUMNS_IGNORE;
    const nStudents = data.length;
    let params = '(?, ?, ?, ?)';
    for (let i = 0; i < nColumns - 1; i++) {
      params = params.concat(', ', '(?, ?, ?, ?)');
    }

    for (let i = 0; i < nStudents - 1; i++) {
      params = params.concat(', ', '(?, ?, ?, ?)');
    }

    const index = await this._indexGrade(courseId);

    const sql = `
      INSERT INTO scores (grade_id, student_id, teacher_id, score)
      VALUES
      ${params}
      ON DUPLICATE
        KEY UPDATE
          score = VALUES(score);
    `;

    const valueParams = data.reduce((acc, cur) => {
      let curScores = [];
      valueColumns.forEach((item) => {
        curScores = [...curScores, index[item] || 0, cur.id, userId, cur[item]];
      });
      acc = [...acc, ...curScores];
      return acc;
    }, []);
    try {
      await this.connection.getRepository(Scores).query(sql, valueParams);
    } catch (e) {
      return {
        message: e,
        statusCode: 200,
        data: null,
      };
    }

    return {
      message: 'success',
      statusCode: 200,
      data: null,
    };
  }

  private async _indexGrade(courseId: number) {
    const grade = await this.connection.getRepository(GradeCompositions).find({
      select: {
        id: true,
        name: true,
      },
      where: {
        courseId,
      },
    });

    return grade.reduce((acc, cur) => {
      acc[cur.name] = cur.id;
      return acc;
    }, {});
  }

  async deleteScoreByStudentCode(
    teacherId: number,
    deleteScoreByStudentCodes: DeleteScoreByStudentCodeDto,
  ): Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();
    try {
      if (deleteScoreByStudentCodes.oldStudentId) {

        const deleteScore = await runner.manager
          .getRepository(Scores)
          .createQueryBuilder('scores')
          .leftJoinAndSelect(
            GradeCompositions,
            'grade',
            'grade.id = scores.grade_id',
          )
          .where('student_id = :oldStudentId and course_id = :courseId', {
            oldStudentId: deleteScoreByStudentCodes.oldStudentId,
            courseId: deleteScoreByStudentCodes.courseId,
          })
          .getMany()
          .then((scores) => {
            return runner.connection.getRepository(Scores).remove(scores);
          });

      }
      return {
        message: 'Delete successfully',
        statusCode: 200,
        data: null,
      };
    } catch (e) {
      return {
        message: 'Error',
        statusCode: 400,
        data: e,
      };
    }
  }
  async updateScoresByStudentCode(
    teacherId: number,
    addScoreByStudentCodes: AddScoreByStudentCodeDto[],
    courseId: number,
  ): Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();
    try {
      // Step 1: The teacher is correct
      const isTeacherCorrect = await this.courseService.isTeacherInCourse(
        courseId,
        teacherId,
      );
      if (!isTeacherCorrect) {
        return {
          message: 'The teacher id is invalid',
          statusCode: 400,
          data: null,
        };
      }
      // Step 2: validate scores
      if (!addScoreByStudentCodes || !addScoreByStudentCodes.length) {
        return {
          message: 'The scores are invalid',
          statusCode: 400,
          data: null,
        };
      }

      // insert on duplicate
      const N_COLUMNS = Object.keys(addScoreByStudentCodes[0].scores).length;
      let params = '(?, ?, ?, ?)';
      for (let i = 0; i < addScoreByStudentCodes.length * N_COLUMNS - 1; i++) {
        params += ', (?, ?, ?, ?)';
      }

      const index = await this._indexGrade(courseId);

      const sql = `
        INSERT INTO scores (grade_id, student_id, teacher_id, score)
        VALUES
        ${params}
        ON DUPLICATE
          KEY UPDATE
            score = VALUES(score);
      `;

      // warning: if the column which posted is not match to db, the default score is 0.
      const valueParams = addScoreByStudentCodes.reduce((acc, cur) => {
        let curScores = [];
        Object.keys(addScoreByStudentCodes[0].scores).forEach((item) => {
          curScores = [
            ...curScores,
            index[item] || 0,
            cur.studentCode,
            teacherId,
            cur.scores[item],
          ];
        });
        acc = [...acc, ...curScores];
        return acc;
      }, []);

      await runner.manager.getRepository(Scores).query(sql, valueParams);
      return {
        message: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'Internal Error!',
        statusCode: 400,
        data: null,
      };
    } finally {
      await runner.release();
    }
  }

  async createUpdateColumns(
    courseId: number,
    userId: number,
    data: CreateUpdateColumnDto[],
  ): Promise<any> {
    const runner = this.connection.createQueryRunner();

    const ids = data?.filter((item) => !!item.id)?.map((item) => item.id);
    const deleteScore = await runner.manager
      .getRepository(Scores)
      .createQueryBuilder('scores')
      .leftJoinAndSelect(
        GradeCompositions,
        'grade',
        'grade.id = scores.grade_id',
      )
      .where('grade_id NOT IN (:...ids) and course_id = :courseId', {
        ids,
        courseId,
      })
      .getMany()
      .then((scores) => {
        return runner.connection.getRepository(Scores).remove(scores);
      });

    const deletePromise = await runner.manager
      .getRepository(GradeCompositions)
      .createQueryBuilder()
      .delete()
      .from(GradeCompositions)
      .where('id NOT IN (:...ids) AND courseId = :courseId', { ids, courseId })
      .execute();

    const updatePromises = data
      ?.filter((item) => typeof item.id === 'number')
      .map((item) => {
        const { id, ...updateData } = item;
        return runner.manager.getRepository(GradeCompositions).update(
          {
            id: id,
          },
          { ...updateData, order: data.indexOf(item) },
        );
      });

    const createData = data?.filter((item) => typeof item.id === 'string');
    const createPromises = runner.connection
      .getRepository(GradeCompositions)
      .createQueryBuilder()
      .insert()
      .into(GradeCompositions)
      .values(
        createData.map((item) => {
          return {
            courseId: courseId,
            name: item.name,
            scale: item.scale,
            isFinal: item.isFinal,
            order: data.indexOf(item),
          };
        }),
      )
      .execute();

    try {
      await Promise.all([updatePromises, createPromises]);
      console.log('Bulk update successful');
    } catch (error) {
      // Handle errors, you can throw or log as needed
      console.error('Error in bulk update:', error);
      throw new NotFoundException('Failed to update records');
    }

    return {
      message: 'Update Successfully!',
      statusCode: 200,
      data: [],
    };
  }
}
