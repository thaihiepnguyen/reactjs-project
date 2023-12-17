import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/typeorm/entity/Courses';
import { Participants } from 'src/typeorm/entity/Participants';
import { Users } from 'src/typeorm/entity/Users';
import { Connection, In, Like, Repository } from 'typeorm';
import { EnrolledCoursesResponse, MyCoursesResponse } from './course.typing';
import { v4 as uuidv4 } from 'uuid';
import { TBaseDto } from '../../app.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
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
          message: e,
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
            message: e,
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
        id: item.id
      }
    });
  }

  async enrollCourse(userId: number, classCode: string): Promise<boolean> { 
    const course = await this.connection.getRepository(Courses).findOne({
      select: {
        id: true,
        isActive: true,
        isValid: true
      },
      where: {
        classCode
      }
    });

    if (!course || !course.isValid || !course.isActive) {
      return false
    }

    try {
      await this.connection
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
    } catch (e) {
      return false;
    }

    return true;
  }

  async removeCourse(id: number): Promise<TBaseDto<null>> {
    try {
      await this.connection.getRepository(Courses).update(id, {
        isValid: false,
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
        id
      },
    });
    if (!course) {
      new ForbiddenException('This course not found!');
      return;
    }

    const participants = await this.connection.getRepository(Participants).find({
      where: {
        courseId: course.id
      },
      select: {
        studentId: true
      }
    });
    if (!participants || !participants.length) {
      new ForbiddenException('Maybe you have not joined this course!');
      return;
    }

    if (!course.isActive) {
      new ForbiddenException('This course is blocked by admin!');
      return;
    }

    if (!course.teacherIds.includes('' + userId)) {
      new ForbiddenException("Maybe you aren't a teacher of this course!");
      return;
    }

    const teacherIds = course.teacherIds?.split(", ")?.map(idStr => +idStr);
    const studentIds = participants.map(item => item.studentId);

    const [teacherList, studentList] = await Promise.all([
      this.connection.getRepository(Users).find({
        where: {
          id: In(teacherIds)
        }
      }),
      this.connection.getRepository(Users).find({
        where: {
          id: In(studentIds)
        }
      })
    ])

    return {
      message: 'success',
      statusCode: 200,
      data: {
        ...course,
        teacherList: teacherList,
        studentList: studentList
      },
    };
  }
}
