import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Courses } from "src/typeorm/entity/Courses";
import { Participants } from "src/typeorm/entity/Participants";
import { Users } from "src/typeorm/entity/Users";
import { Connection, In, Repository } from "typeorm";
import { MyCoursesResponse } from "./course.typing";
import { title } from "process";

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

  async getMyCourses(userId: number): Promise<MyCoursesResponse[]> {
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
}