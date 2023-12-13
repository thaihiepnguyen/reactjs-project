import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { TBaseDto } from "src/app.dto";
import { CourseService } from "src/modules/course/course.service";
import { Courses } from "src/typeorm/entity/Courses";
import { Connection } from "typeorm";


const PAGING_LIMIT = 15;
@Injectable()
export class CourseListService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly courseService: CourseService
  ) {}
  async getAll(page: number) {
    const offset = (page - 1) * PAGING_LIMIT;

    const [list, count] = await Promise.all(
      [this.connection.getRepository(Courses).find({
      select: {
        id: true,
        title: true,
        description: true,
        teacherIds: true,
        classCode: true,
        isValid: true,
      },
      take: PAGING_LIMIT,
      skip: offset
    }), this.connection.getRepository(Courses).count()]);

    const teacherIds = await this.courseService._indexTeachersByCourses(list);
    
    const listDetail = list.map(item => {
      const ids = item.teacherIds.split(',').map(item => teacherIds[+item])
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        classCode: item.classCode,
        isValid: item.isValid,
        teachers: ids
      }
    });

    return {
      list: listDetail,
      currentPage: page,
      totalItem: count,
      totalPage: Math.floor(count / PAGING_LIMIT) === count / PAGING_LIMIT ? count / PAGING_LIMIT : Math.floor(count / PAGING_LIMIT) + 1,
      size: list.length
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
      }
    });

    const teacherIds = await this.courseService._indexTeachersByCourses(courses);

    const matchedCourses = courses.filter(item => {
      const ids = item.teacherIds.split(',').map(item => teacherIds[+item]);
      const patterns = ids.reduce((acc, cur) => {
        acc += cur.fullname;
        return acc;
      }, item.title + item.description);

      return this._normalize(patterns).includes(this._normalize(query))
    })

    const listTotal = matchedCourses.map(item => {
      const ids = item.teacherIds.split(',').map(item => teacherIds[+item])
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        classCode: item.classCode,
        isValid: item.isValid,
        teachers: ids
      }
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
        totalPage: Math.floor(matchedCourses.length / PAGING_LIMIT) === matchedCourses.length / PAGING_LIMIT 
        ? matchedCourses.length / PAGING_LIMIT : Math.floor(matchedCourses.length / PAGING_LIMIT) + 1,
        size: list.length
      }
    };
  }

  private _normalize(pattern: string) {
    return pattern.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('Đ', 'D');
  }
}