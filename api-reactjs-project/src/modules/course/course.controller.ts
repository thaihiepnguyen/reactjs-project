import {Body, Controller, Get, Post} from "@nestjs/common";
import { Role } from "../auth/roles/role.enum";
import { Roles } from "../auth/roles/roles.decorator";
import { CourseService } from "./course.service";
import { MetaDataAuth } from "../auth/auth.decorator";
import {TBaseDto} from "../../app.dto";


@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get('user/enrolled-courses')
  @Roles(Role.Student, Role.Teacher)
  async getEnrolledCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<any>> {
    return {
      message: 'Get my courses successfully',
      data: await this.courseService.getEnrolledCourses(userId),
      statusCode: 200,
    };
  }

  @Get('user/my-courses')
  @Roles(Role.Teacher)
  async getMyCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<any>> {
    console.log('userId', userId)
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
  ): Promise<any> {
    const inserted = await this.courseService.addMyCourses(userId, name, description, classCode)
    if (!inserted) {
      return {
        message: 'Add a course failed',
        data: null,
        statusCode: 400,
      };
    }
    return {
      message: 'Add a course successfully',
      data: null,
      statusCode: 201,
    };
  }

  @Post('user/enroll-courses/add')
  @Roles(Role.Teacher)
  async enrollCourse(
    @MetaDataAuth('userId') userId: number,
    @Body('classCode') classCode: string,
  ): Promise<any> {
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