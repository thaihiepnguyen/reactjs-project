import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { TBaseDto } from 'src/app.dto';
import { CourseService } from 'src/modules/course/course.service';
import { Courses } from 'src/typeorm/entity/Courses';
import { Connection } from 'typeorm';

const PAGING_LIMIT = 15;
@Injectable()
export class CourseListService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService,
  ) {}
  async getAll(page: number) {
    const offset = (page - 1) * PAGING_LIMIT;

    const [list, count] = await Promise.all([
      this.connection.getRepository(Courses).find({
        select: {
          id: true,
          title: true,
          description: true,
          teacherIds: true,
          classCode: true,
          isValid: true,
          isActive: true,
        },
        take: PAGING_LIMIT,
        skip: offset,
      }),
      this.connection.getRepository(Courses).count(),
    ]);

    const teacherIds = await this.courseService._indexTeachersByCourses(list);

    const listDetail = list.map((item) => {
      const ids = item.teacherIds.split(',').map((item) => teacherIds[+item]);
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        classCode: item.classCode,
        isValid: item.isValid,
        teachers: ids,
        isActive: item.isActive,
      };
    });

    return {
      list: listDetail,
      currentPage: page,
      totalItem: count,
      totalPage: Math.ceil(count / PAGING_LIMIT),
      size: list.length,
    };
  }

  async search(page: number, query: string): Promise<TBaseDto<any>> {
    const courses = await this.connection.getRepository(Courses).find({
      select: {
        id: true,
        title: true,
        description: true,
        teacherIds: true,
        classCode: true,
        isValid: true,
        isActive: true
      },
    });

    const teacherIds =
      await this.courseService._indexTeachersByCourses(courses);

    const matchedCourses = courses.filter((item) => {
      const ids = item.teacherIds.split(',').map((item) => teacherIds[+item]);
      const patterns = ids.reduce((acc, cur) => {
        acc += cur.fullname;
        return acc;
      }, item.title + item.description);

      return this._normalize(patterns).includes(this._normalize(query));
    });

    const listTotal = matchedCourses.map((item) => {
      const ids = item.teacherIds.split(',').map((item) => teacherIds[+item]);
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        classCode: item.classCode,
        isValid: item.isValid,
        isActive: item.isActive,
        teachers: ids,
      };
    });

    const offset = (page - 1) * PAGING_LIMIT;
    const list = listTotal.slice(offset, page * PAGING_LIMIT);

    return {
      message: 'success',
      statusCode: 200,
      data: {
        list: list,
        currentPage: page,
        totalItem: matchedCourses.length,
        totalPage: Math.ceil(matchedCourses.length / PAGING_LIMIT),
        size: list.length,
      },
    };
  }

  private _normalize(pattern: string) {
    return pattern
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('Đ', 'D');
  }

  async createCourse(
    formData: FormData
  ) {
    try {
      // const { name, description, class_code } = formData;

      // Call the service method to create a course
      // const newCourse = await this.courseListSerivce.createCourse({ name, description, class_code });
      console.log(formData);
      return {
        statusCode: 201, 
        // data: newCourse, 
        message: 'Course created successfully!',
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: null,
        message: 'Failed to create course.',
      };
    }
  }

  async putActive(
    courseId: number,
    isActive: boolean,
  ): Promise<TBaseDto<null>> {
    try {
      await this.connection.getRepository(Courses).update(
        {
          id: courseId,
        },
        {
          isActive: isActive,
        },
      );
    } catch (e) {
      console.log(e);
      return {
        message: e,
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
}
