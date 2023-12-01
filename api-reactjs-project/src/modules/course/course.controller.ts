import {Body, Controller, Get, Post} from "@nestjs/common";
import { Role } from "../auth/roles/role.enum";
import { Roles } from "../auth/roles/roles.decorator";
import { CourseService } from "./course.service";
import { MetaDataAuth } from "../auth/auth.decorator";
import {TBaseDto} from "../../app.dto";
import {EnrolledCoursesResponse, MyCoursesResponse} from "./course.typing";


@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get('user/enrolled-courses')
  @Roles(Role.Student, Role.Teacher)
  async getEnrolledCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<EnrolledCoursesResponse[]>> {
    return {
      message: 'Get enrolled courses successfully',
      data: await this.courseService.getEnrolledCourses(userId),
      statusCode: 200,
    };
  }

  @Get('user/my-courses')
  @Roles(Role.Teacher)
  async getMyCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<MyCoursesResponse[]>> {
    return {
      message: 'Get my courses successfully',
      data: await this.courseService.getMyCourses(userId),
      statusCode: 200,
    };
  }

  @Post('user/my-courses/add')
  @Roles(Role.Teacher)
  async addCourse(
    @MetaDataAuth('userId') userId: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('classCode') classCode?: string,
  ): Promise<TBaseDto<null>> {
    return await this.courseService.addMyCourses(userId, name, description, classCode)
  }

  @Post('user/enroll-courses/add')
  @Roles(Role.Teacher)
  async enrollCourse(
    @MetaDataAuth('userId') userId: number,
    @Body('classCode') classCode: string,
  ): Promise<TBaseDto<null>> {
    const enrolled = await this.courseService.enrollCourse(userId, classCode)
    if (!enrolled) {
      return {
        message: 'Enroll a course failed',
        data: null,
        statusCode: 400,
      };
    }
    return {
      message: 'Enroll a course successfully',
      data: null,
      statusCode: 201,
    };
  }
}