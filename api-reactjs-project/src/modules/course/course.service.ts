import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Courses } from 'src/typeorm/entity/Courses';
import { Participants } from 'src/typeorm/entity/Participants';
import { Users } from 'src/typeorm/entity/Users';
import { Connection, In, IsNull, Like, Not } from 'typeorm';
import { EnrolledCoursesResponse, MyCoursesResponse } from './course.typing';
import { v4 as uuidv4 } from 'uuid';
import { TBaseDto } from '../../app.dto';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as xlsx from 'xlsx';
import { AbsentPariticipants } from '../../typeorm/entity/AbsentPariticipants';

const COLUMN_STUDENT_ID = 'Student ID';
const COLUMN_FULLNAME = 'Full name';
@Injectable()
export class CourseService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async getEnrolledCourses(userId: number): Promise<EnrolledCoursesResponse[]> {
    const participants = await this.connection
      .getRepository(Participants)
      .find({
        select: ['courseId'],
        where: {
          studentId: userId,
        },
      });
    const courseIds = participants.map((p) => p.courseId as number);
    if (courseIds.length === 0) {
      return [];
    }
    const courses = await this.connection.getRepository(Courses).find({
      where: {
        id: In(courseIds),
        isValid: true,
      },
    });

    const index = await this._indexTeachersByCourses(courses);

    return courses.map((item) => {
      return {
        title: item.title,
        description: item.description,
        teacherName: index[item.teacherIds.split(',')[0]].fullname,
        teacherAvatar: index[item.teacherIds.split(',')[0]].avatarUrl,
        lastModify: this._formatDate(item.updatedAt),
        id: item.id,
      };
    });
  }

  async _indexTeachersByCourses(courses: Courses[]) {
    const teacherIds = courses.reduce((acc, cur) => {
      const ids = cur.teacherIds.split(',').map((id) => Number(id));
      for (const id of ids) {
        if (!acc.includes(id)) {
          acc.push(id);
        }
      }
      return acc;
    }, []);

    const teachers = await this.connection.getRepository(Users).find({
      where: {
        id: In(teacherIds),
        isValid: true,
      },
    });

    return teachers.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  }
  _formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-GB', options);
  }

  async addMyCourses(
    userId: number,
    name: string,
    description: string,
    classCode?: string,
  ): Promise<TBaseDto<null>> {
    if (!classCode) {
      classCode = uuidv4();
      try {
        await this.connection
          .getRepository(Courses)
          .createQueryBuilder()
          .insert()
          .into(Courses)
          .values([
            {
              title: name,
              description: description,
              teacherIds: userId.toString(),
              classCode,
            },
          ])
          .execute();
      } catch (e) {
        console.log(e);
        return {
          message: e.message,
          data: null,
          statusCode: 400,
        };
      }
      return {
        message: 'Add a course successfully',
        data: null,
        statusCode: 201,
      };
    } else {
      const classCodes = await this.connection.getRepository(Courses).find({
        select: {
          classCode: true,
        },
      });
      const isCodeExisted = classCodes.reduce((acc, cur) => {
        if (cur.classCode === classCode) {
          acc = true;
        }
        return acc;
      }, false);

      if (!isCodeExisted) {
        try {
          await this.connection
            .getRepository(Courses)
            .createQueryBuilder()
            .insert()
            .into(Courses)
            .values([
              {
                title: name,
                description: description,
                teacherIds: userId.toString(),
                classCode,
              },
            ])
            .execute();
        } catch (e) {
          return {
            message: e.message,
            data: null,
            statusCode: 400,
          };
        }
        return {
          message: 'Add a course successfully',
          data: null,
          statusCode: 201,
        };
      } else {
        return {
          message: 'The class Id existed',
          data: null,
          statusCode: 400,
        };
      }
    }
  }

  async getMyCourses(userId: number): Promise<MyCoursesResponse[]> {
    const courses = await this.connection.getRepository(Courses).find({
      where: {
        teacherIds: Like(`%${userId}%`),
        isValid: true,
      },
    });

    return courses.map((item) => {
      return {
        title: item.title,
        description: item.description,
        lastModify: this._formatDate(item.updatedAt),
        isActive: item.isActive,
        id: item.id,
        teacherIds: item.teacherIds,
      };
    });
  }

  async enrollCourse(userId: number, classCode: string): Promise<any> {
    const runner = this.connection.createQueryRunner();

    try {
      const course = await runner.manager.getRepository(Courses).findOne({
        where: {
          classCode,
        },
      });

      if (!course || !course.isValid || !course.isActive) {
        return {
          status: false,
          msg: 'Course not found',
        };
      }

      // validate user id
      const user = await runner.manager.getRepository(Users).findOne({
        where: {
          id: userId,
          isValid: true,
        },
        select: {
          studentId: true,
        },
      });

      if (!user || !user.studentId) {
        return {
          status: false,
          msg: 'You must add student id at your profile',
          data: course.id,
        };
      }

      const userRole = await this.authService.getRole(userId);
      if (userRole.role.name === 'teacher') {
        if (!course.teacherIds.includes(`${userId}`)) {
          const newIds = course.teacherIds + `, ${userId}`;
          await runner.manager.getRepository(Courses).update(
            {
              id: course.id,
            },
            {
              teacherIds: newIds,
            },
          );
        } else {
          return {
            status: false,
            msg: 'You have already enrolled this course',
            data: course.id,
          };
        }
      }
      if (userRole.role.name === 'student') {
        const alreadyJoin = await runner.manager
          .getRepository(Participants)
          .findOne({
            where: {
              courseId: course.id,
              studentId: userId,
            },
          });

        if (alreadyJoin) {
          return {
            status: false,
            msg: 'You have already enrolled this course',
            data: course.id,
          };
        }
      }
      await runner.manager
        .getRepository(Participants)
        .createQueryBuilder()
        .insert()
        .into(Participants)
        .values([
          {
            studentId: userId,
            courseId: course.id,
          },
        ])
        .execute();

      return {
        status: true,
        msg: 'Enrolled course successfully',
        data: course.id,
      };
    } catch (e) {
      return {
        status: false,
        msg: e.message,
        data: null,
      };
    }
  }

  async removeCourse(userId: number, id: number): Promise<TBaseDto<null>> {
    try {
      const course = await this.connection.getRepository(Courses).findOne({
        where: {
          id: id,
        },
      });
      if (course && course.teacherIds.indexOf(`${userId}`) === 0) {
        await this.connection.getRepository(Courses).update(id, {
          isValid: false,
        });
      } else {
        const newIds = course?.teacherIds?.replace(`, ${userId}`, '');
        await this.connection.getRepository(Courses).update(id, {
          teacherIds: newIds,
        });
      }
    } catch (e) {
      console.log(e);
      return {
        message: 'failed',
        statusCode: 400,
        data: null,
      };
    }
    return {
      message: 'success',
      statusCode: 200,
      data: null,
    };
  }

  async unenrollCourse(userId: number, id: number): Promise<TBaseDto<null>> {
    try {
      await this.connection.getRepository(Participants).delete({
        courseId: id,
        studentId: userId,
      });
    } catch (e) {
      console.log(e);
      return {
        message: 'failed',
        statusCode: 400,
        data: null,
      };
    }
    return {
      message: 'success',
      statusCode: 200,
      data: null,
    };
  }

  async getMyCourseDetail(id: number, userId: number): Promise<TBaseDto<any>> {
    // the userId is a teacher's id
    const course = await this.connection.getRepository(Courses).findOne({
      where: {
        id,
      },
    });
    if (!course) {
      throw new ForbiddenException({
        message: 'This course not found!',
      });
    }

    const participants = await this.connection
      .getRepository(Participants)
      .find({
        where: {
          courseId: course.id,
        },
        select: {
          studentId: true,
        },
      });

    const studentIds = participants.map((item) => item.studentId);
    const teacherIds = course.teacherIds?.split(', ')?.map((idStr) => +idStr);

    if (!teacherIds.includes(userId) && !studentIds.includes(userId)) {
      throw new ForbiddenException({
        message: 'Maybe you have not joined this course!',
      });
    }

    if (!course.isActive) {
      throw new ForbiddenException({
        message: 'This course is blocked by admin!',
      });
    }

    // if (!course.teacherIds.includes('' + userId)) {
    //   throw new ForbiddenException("Maybe you aren't a teacher of this course!");
    // }

    const [teacherList, studentList, absentStudentList] = await Promise.all([
      this.connection.getRepository(Users).find({
        where: {
          id: In(teacherIds),
        },
      }),
      this.connection.getRepository(Users).find({
        where: {
          id: In(studentIds),
        },
      }),
      this.connection.getRepository(AbsentPariticipants).find({
        where: {
          courseId: course.id,
        },
      }),
    ]);

    return {
      message: 'success',
      statusCode: 200,
      data: {
        ...course,
        teacherList: teacherList,
        studentList: studentList,
        absentStudentList: absentStudentList,
      },
    };
  }

  public async isCourseExist(id: number): Promise<boolean> {
    return await this.connection
      .getRepository(Courses)
      .exist({ where: { id: id } });
  }

  public async isTeacherInCourse(id: number, teacherId: number) {
    return await this.connection.getRepository(Courses).exist({
      where: {
        id: id,
        teacherIds: Like(`%${teacherId}%`),
      },
    });
  }

  public async banStudent(
    teacherId: number,
    studentId: number,
    courseId: number,
  ): Promise<TBaseDto<null>> {
    // Step 1: courseId belongs to teacherId
    if (!(await this.isTeacherInCourse(courseId, teacherId))) {
      return {
        message: 'the teacher must be in this course',
        statusCode: 400,
      };
    }
    // Step 3: studentId has been in courseId or not
    const isStudentExisted = await this.connection
      .getRepository(Participants)
      .exist({
        where: {
          courseId,
          studentId,
        },
      });

    if (!isStudentExisted) {
      return {
        message: 'student is not in this course yet',
        statusCode: 400,
      };
    }

    // Step 2: remove record from participant
    try {
      await this.connection
        .getRepository(Participants)
        .createQueryBuilder()
        .delete()
        .from(Participants)
        .where('courseId = :courseId', { courseId })
        .andWhere('studentId = :studentId', { studentId })
        .execute();
      return {
        message: 'success',
        statusCode: 200,
      };
    } catch (e) {
      return {
        message: e,
        statusCode: 400,
      };
    }
  }

  public async inviteToCourse(emails: string[], courseId: string) {
    const runner = this.connection.createQueryRunner();

    const course = await runner.connection.getRepository(Courses).findOne({
      where: {
        id: +courseId,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const rawData = await runner.connection.query(
      `SELECT * FROM email_templates WHERE id = 3`,
    );
    const content = rawData[0].content;

    if (!content) {
      throw new NotFoundException('Email template not found');
    }
    const html = content
      .replace('$courseName$', course.title)
      .replace('$url$', process.env.CLIENT_URL)
      .replace('classCode', course.classCode);

    await this.mailerService.sendMail({
      to: emails,
      from: process.env.USER_NODEMAILER,
      subject: `Invitation to ${course.title} course`,
      html: html,
    });

    return {
      data: 'success',
    };
  }

  public async saveStudentList(
    file: Express.Multer.File,
    userId: number,
  ): Promise<TBaseDto<null>> {
    const runner = this.connection.createQueryRunner();
    try {
      const workbook = xlsx.readFile(`uploads/template/${file.filename}`);
      const courseId = +file.filename.split('.')[0];

      // Step 1: the teacher must be in this courseId
      if (!(await this.isTeacherInCourse(courseId, userId))) {
        return {
          message: 'The teacher must be in this course',
          statusCode: 400,
          data: null,
        };
      }

      // Step 2: load data from sheets
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

      // Step 3: filter students who have not joined this course yet
      const studentSheetIds = data.map((item) => item[COLUMN_STUDENT_ID]);
      const studentSheetIdsHaveStudentCode = [];
      const studentIdsHaveStudentCode = await runner.manager
        .getRepository(Users)
        .find({
          where: {
            studentId: Not(IsNull()),
          },
          select: {
            studentId: true,
            id: true,
          },
        });

      const studentIdsHaveStudentCodeIndex = studentIdsHaveStudentCode.reduce(
        (acc, cur) => {
          acc[cur.studentId] = cur;
          return acc;
        },
        {},
      );

      studentSheetIds.forEach((item) => {
        if (studentIdsHaveStudentCodeIndex[item]) {
          studentSheetIdsHaveStudentCode.push(
            studentIdsHaveStudentCodeIndex[item],
          );
        }
      });

      const sql = `
        SELECT 
          u.student_id as studentId,
          u.id
        FROM participants p, users u
        WHERE p.student_id = u.id
        AND u.is_valid = 1
        AND p.student_id is not null
        AND p.course_id = ?;
      `;

      const students = await runner.manager.query(sql, [courseId]);
      const indexStudentIds = students.reduce((acc, cur) => {
        acc[cur.studentId] = true;
        return acc;
      }, {});
      const studentSheetIdsHaveStudentCodeAndUnJoined = [];
      studentSheetIdsHaveStudentCode.forEach((item) => {
        if (!indexStudentIds[item.studentId]) {
          studentSheetIdsHaveStudentCodeAndUnJoined.push({
            courseId: courseId,
            studentId: item.id,
          });
        }
      });

      await runner.manager
        .getRepository(Participants)
        .createQueryBuilder()
        .insert()
        .into(Participants)
        .insert()
        .orIgnore()
        .values(studentSheetIdsHaveStudentCodeAndUnJoined)
        .execute();

      const absentStudentIds = [];
      studentSheetIds.forEach((item) => {
        if (!studentIdsHaveStudentCodeIndex[item]) {
          absentStudentIds.push({
            studentId: item,
            courseId: courseId,
          });
        }
      });
      await runner.manager
        .getRepository(AbsentPariticipants)
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .into(AbsentPariticipants)
        .values(absentStudentIds)
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
    } finally {
      await runner.release();
    }
  }
}
