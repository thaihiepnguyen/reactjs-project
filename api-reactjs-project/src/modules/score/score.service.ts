import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { TBaseDto } from 'src/app.dto';
import { GradeCompositions } from 'src/typeorm/entity/GradeCompositions';
import { Connection, In, IsNull, Like, Not } from 'typeorm';
import { CourseService } from '../course/course.service';
import {
  AddScoreByStudentCodeDto,
  ColumnDto,
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
import { NotificationService } from '../notification/notification.service';
import { RequestReview } from 'src/typeorm/entity/RequestReview';
import { RequestMessage } from 'src/typeorm/entity/RequestMessage';
import { AbsentPariticipants } from 'src/typeorm/entity/AbsentPariticipants';

const N_COLUMNS_IGNORE = 2;
const COLUMN_ID = 'studentId';
const COLUMN_FULLNAME = 'fullname';
@Injectable()
export class ScoreService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService,
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
    if (!(await this.courseService.isCourseExist(courseId))) {
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
        message: e.message,
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

      const sql2 = `
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

      await runner.manager.getRepository(Scores).query(sql2, valueParams);

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

      const absentStudentList = await runner.manager
        .getRepository(AbsentPariticipants)
        .find({
          select: {
            studentId: true,
          },
          where: {
            courseId: id,
            studentId: Not(IsNull()),
          },
        })
        .then((data) =>
          data.map((item) => ({
            studentId: item.studentId,
            fullname: '',
          })),
        );

      return {
        message: 'success',
        statusCode: 200,
        data: {
          rows: [...students, ...absentStudentList] as unknown as Row[],
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
      return {
        message: e.message,
        statusCode: 400,
        data: null,
      };
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
    const data = [];
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
    let n_params = '(?, ?, ?, ?)';
    for (let i = 0; i < nColumns - 1; i++) {
      n_params = n_params.concat(', ', '(?, ?, ?, ?)');
    }
    let params: string = n_params;
    for (let i = 0; i < nStudents - 1; i++) {
      params = params.concat(', ', n_params);
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
        curScores = [
          ...curScores,
          index[item] || 0,
          cur.studentId,
          userId,
          cur[item],
        ];
      });
      acc = [...acc, ...curScores];
      return acc;
    }, []);
    try {
      await this.connection.getRepository(Scores).query(sql, valueParams);
    } catch (e) {
      return {
        message: e.message,
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
  /*
   * Update scores of the student if record have already existed. Otherwise, create new scores
   *
   * @param teacherId
   * @param addScoreByStudentCodes { studentCode; scores; oldStudentId }
   * @param courseId
   *
   * Return null
   */
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
      // Step 2: Validate scores
      if (!addScoreByStudentCodes || !addScoreByStudentCodes.length) {
        return {
          message: 'The scores are invalid',
          statusCode: 400,
          data: null,
        };
      }

      // Step 3: Insert on duplicate
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

    const notFinalizeBefore = await runner.manager
      .getRepository(GradeCompositions)
      .find({
        where: {
          courseId: courseId,
          isFinal: false,
        },
      })
      .then((data) => {
        return data?.map((item) => item.id);
      });
    const finalizeGrade = data
      ?.filter(
        (grade) => !!grade.isFinal && notFinalizeBefore?.includes(grade?.id),
      )
      ?.map((grade) => grade.id);
    if (finalizeGrade?.length > 0) {
      await this.finalizeColumns(courseId, userId, finalizeGrade);
    }
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
    const createPromises = runner.manager
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
  /*
   * Finalize score's columns of a course and notify to students that are in the course.
   *
   * @param id is a course id
   * @param teacherId
   * @param gradeIds are columns of this course
   *
   * Return null
   */
  async finalizeColumns(
    id: number,
    teacherId: number,
    gradeIds: number[],
  ): Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();

    try {
      // Step 1: The gradeIds must be in this course
      const rawData = await runner.manager
        .getRepository(GradeCompositions)
        .find({
          where: {
            courseId: id,
          },
        });

      const rawGradeIds = rawData.map((item) => item.id);

      let isGradeValid = true;
      gradeIds.forEach((item) => {
        if (!rawGradeIds.includes(item)) {
          isGradeValid = false;
        }
      });
      if (!isGradeValid) {
        return {
          message: 'gradeIds that you send to are incorrect',
          statusCode: 400,
          data: null,
        };
      }

      // Step 2: turn is_final columns
      const sql = `
        UPDATE grade_compositions
        SET is_final = 1
        WHERE id IN (?);
      `;

      await runner.manager
        .getRepository(GradeCompositions)
        .query(sql, [gradeIds]);
      // Step 3: notify to students who are in this course
      await this.notificationService.pushScores(
        id,
        gradeIds,
        'Thông báo điểm thi',
      );
      return {
        message: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        message: e.message,
        statusCode: 400,
        data: null,
      };
    } finally {
      await runner.release();
    }
  }

  public async studentGetCourse(userId: number, courseId: number) {
    const runner = this.connection.createQueryRunner();
    const user = await runner.manager.getRepository(Users).findOne({
      select: {
        studentId: true,
      },
      where: {
        id: userId,
      },
    });
    if (!user || !user.studentId) {
      return {
        scoreData: [],
        data: [],
      };
    }

    const gradeCompositions = await runner.manager
      .getRepository(GradeCompositions)
      .find({
        select: {
          id: true,
        },
        where: {
          courseId: courseId,
        },
        order: {
          order: 'ASC',
        },
      });

    const gradeIds = gradeCompositions.map((grade) => grade.id);
    const scores = await runner.manager
      .getRepository(Scores)
      .createQueryBuilder('scores')
      .where(
        'scores.grade_id IN (:...gradeIds) and scores.student_id = :studentId',
        { gradeIds, studentId: user.studentId }, 
      )
      .leftJoinAndSelect(
        GradeCompositions,
        'grade', 
        'grade.id = scores.grade_id',
      )
      .leftJoinAndSelect(Users, 'users', 'users.id = scores.teacher_id')
      .leftJoinAndSelect(
        RequestReview,
        'requestReview', 
        'requestReview.score_id = scores.id',
      )
      .orderBy('grade.order', "ASC")
      .execute();

    let avg = 0;
    let showAvg = true;
    const scoreData = [];

    for (const score of scores) {
      if (showAvg) {
        avg += (score.scores_score * score.grade_scale) / 100;
      }
      if (!score.grade_is_final) {
        showAvg = false;
      }

      const requestReview = await runner.manager
        .getRepository(RequestReview)
        .findOne({
          where: {
            scoreId: score.scores_id,
          },
          order: {
            messages: {
              order: 'ASC',
            },
          },
          relations: {
            messages: true,
          },
        });

      scoreData.push({
        id: score.scores_id,
        'Grade Item': score.grade_name,
        Score: score.grade_is_final ? score.scores_score : 'Not scored yet',
        'Contribution to course total': score.grade_scale + '%',
        Teacher: score.users_fullname,
        disableReview: !score.grade_is_final,
        acceptSendRequest: score.requestReview_accept_new_request !== 0,
        messages: requestReview?.messages ?? [],
        disableSendRequest: !!requestReview?.isFinal,
      });
    }

    if (showAvg) {
      scoreData.push({
        'Grade Item': 'Total Score',
        Score: avg.toFixed(2),
        'Contribution to course total': '100%',
        Teacher: '',
        disableReview: true,
      });
    }
    return {
      scoreData: scoreData,
      data: 'success',
    };
  }

  public async requestReview(
    id: number,
    userId: number,
    message: string,
    scoreId: number,
  ): Promise<TBaseDto<any>> {
    const runner = this.connection.createQueryRunner();

    const teacherIds = await runner.manager
      .getRepository(Courses)
      .findOne({
        where: {
          id: id,
        },
        select: {
          teacherIds: true,
        },
      })
      .then((data) => data.teacherIds);

    const existsRequest = await runner.manager
      .getRepository(RequestReview)
      .findOne({
        where: {
          scoreId: scoreId,
        },
        relations: {
          messages: true,
        },
      });

    if (existsRequest && existsRequest.isFinal) {
      throw new HttpException(
        'This request already marked as final by teacher',
        403,
      );
    }
    if (existsRequest && !existsRequest.acceptNewRequest) {
      throw new HttpException(
        'Please wait for the instructor to respond to your previous request',
        403,
      );
    }

    if (!existsRequest) {
      const newRequest = new RequestReview();
      newRequest.scoreId = scoreId;
      await runner.manager.save(newRequest);

      const newMessage = new RequestMessage();
      newMessage.message = message;
      newMessage.from = userId;
      newMessage.request = newRequest;
      newMessage.order = 0;
      await runner.manager.save(newMessage);
      await this.notificationService.pushRequestReview(id, scoreId, teacherIds);
    }

    if (existsRequest && existsRequest.acceptNewRequest) {
      const newMessage = new RequestMessage();
      newMessage.message = message;
      newMessage.from = userId;
      newMessage.request = existsRequest;
      newMessage.order = existsRequest.messages.length;
      await runner.manager.save(newMessage);
      await runner.manager.getRepository(RequestReview).update(
        {
          scoreId: scoreId,
        },
        {
          acceptNewRequest: false,
        },
      );
    }
    await this.notificationService.pushNotificationRequestReview(
      id,
      scoreId,
      teacherIds,
      message,
    );
    return {
      message: 'Resquest has been sent to teacher',
    };
  }
  public async getRequestReview(
    userId: number,
    courseId: number,
  ): Promise<TBaseDto<any>> {
    const runner = this.connection.createQueryRunner();

    const listScoreIds = await runner.manager
      .getRepository(Scores)
      .find({
        where: {
          grade: {
            courseId: courseId,
          },
        },
      })
      .then((result) => result?.map((result) => result.id));

    const listRequestReview = await runner.manager
      .getRepository(RequestReview)
      .find({
        where: {
          scoreId: In(listScoreIds),
        },
        order: {
          messages: {
            order: 'ASC',
          },
        },
        relations: ['score', 'messages', 'score.grade', 'score.student'],
      });
    return {
      message: 'success',
      data: listRequestReview,
    };
  }
  public async teacherAcceptRequest(
    userId: number,
    courseId: number,
    scoreId: number,
    isFinal: boolean,
    message: string,
    score: number,
  ): Promise<TBaseDto<any>> {
    const runner = this.connection.createQueryRunner();

    const requestReview = await runner.manager
      .getRepository(RequestReview)
      .findOne({
        where: {
          scoreId: scoreId,
        },
        relations: {
          messages: true,
        },
      });
    await runner.manager.getRepository(RequestReview).update(
      {
        id: requestReview.id,
      },
      {
        isFinal: isFinal,
        acceptNewRequest: isFinal ? false : true,
      },
    );

    await runner.manager.getRepository(Scores).update(
      {
        id: scoreId,
      },
      {
        score: score,
      },
    );

    const newMessage = new RequestMessage();
    newMessage.message = message;
    newMessage.from = userId;
    newMessage.request = requestReview;
    newMessage.order = requestReview.messages.length;
    await runner.manager.save(newMessage);

    // notify
    await this.notificationService.pushNotificationAcceptRequest(
      courseId,
      scoreId,
      message,
      score,
    );

    return {
      message: 'Success',
    };
  }
}
