import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Courses } from "src/typeorm/entity/Courses";
import { Participants } from "src/typeorm/entity/Participants";
import { Users } from "src/typeorm/entity/Users";
import {Connection, In, Like, Repository} from "typeorm";
import {EnrolledCoursesResponse, MyCoursesResponse} from "./course.typing";
import { v4 as uuidv4 } from 'uuid';
import {TBaseDto} from "../../app.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    @InjectRepository(Participants)
    private readonly participantRepository: Repository<Participants>,
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  async getEnrolledCourses(userId: number): Promise<EnrolledCoursesResponse[]> {
    const participants = await this.participantRepository.find({
      select: ['courseId'],
      where: {
        studentId: userId
      }
    })
    const courseIds = participants.map(p => p.courseId as number);
    if (courseIds.length === 0) {
      return [];
    }
    const courses = await this.coursesRepository.find({
      where: {
        id: In(courseIds),
        isValid: true
      }
    });

    const index = await this._indexTeachersByCourses(courses);

    return courses.map(item => {
      return {
        title: item.title,
        description: item.description,
        teacherName: index[item.teacherIds.split(',')[0]].fullname,
        teacherAvatar: index[item.teacherIds.split(',')[0]].avatarUrl,
        lastModify: this._formatDate(item.updatedAt)
      }
    });
  }

  async _indexTeachersByCourses(courses: Courses[]) {
    const teacherIds = courses.reduce((acc, cur) => {
      const ids = cur.teacherIds.split(',').map(id => Number(id));
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
        isValid: true
      }
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
  };

  async addMyCourses(userId: number, name: string, description: string, classCode?: string): Promise<TBaseDto<any>> {
    if (!classCode) {
      classCode  = uuidv4()
      try {
        await this.coursesRepository
          .createQueryBuilder()
          .insert()
          .into(Courses)
          .values([{title: name, description: description, teacherIds: userId.toString(), classCode}])
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
      const classCodes = await this.coursesRepository.find({
        select: {
          classCode: true
        }
      })
      const isCodeExisted = classCodes.reduce((acc, cur) => {
        if (cur.classCode === classCode) {
          acc = true
        }
        return acc
      }, false)

      if (!isCodeExisted) {
        try {
          await this.coursesRepository
            .createQueryBuilder()
            .insert()
            .into(Courses)
            .values([{title: name, description: description, teacherIds: userId.toString(), classCode}])
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
        }
      }
    }
  }

  async getMyCourses(userId: number): Promise<MyCoursesResponse[]> {
    const courses = await this.coursesRepository.find({
      where: {
        teacherIds: Like(`%${userId}%`),
        isValid: true
      }
    });

    return courses.map(item => {
      return {
        title: item.title,
        description: item.description,
        lastModify: this._formatDate(item.updatedAt)
      }
    });
  }

  async enrollCourse(userId: number, classCode: string): Promise<boolean> {
    const course = await this.coursesRepository.findOne({
      select: {
        id: true
      },
      where: {
        classCode
      }
    })

    if (!course) {
      return false
    }

    try {
      await this.participantRepository
        .createQueryBuilder()
        .insert()
        .into(Participants)
        .values([{
          studentId: userId,
          courseId: course.id
        }])
        .execute()
    } catch (e) {
      return false
    }

    return true
  }
}