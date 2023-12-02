import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import { Role } from "../auth/roles/role.enum";
import { Roles } from "../auth/roles/roles.decorator";
import { CourseService } from "./course.service";
import { MetaDataAuth } from "../auth/auth.decorator";
import {TBaseDto} from "../../app.dto";
import {EnrolledCoursesResponse, MyCoursesResponse} from "./course.typing";
import {RolesGuard} from "../auth/roles/roles.guard";


@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get('user/enrolled-courses')
  async getEnrolledCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<EnrolledCoursesResponse[]>> {
    return {
      message: 'Get enrolled courses successfully',
      data: await this.courseService.getEnrolledCourses(userId),
      statusCode: 200,
    };
  }

  @Get('user/my-courses')
  async getMyCourses(@MetaDataAuth('userId') userId: number): Promise<TBaseDto<MyCoursesResponse[]>> {
    return {
      message: 'Get my courses successfully',
      data: await this.courseService.getMyCourses(userId),
      statusCode: 200,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Post('user/my-courses/add')
  async addCourse(
    @MetaDataAuth('userId') userId: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('classCode') classCode?: string,
  ): Promise<TBaseDto<null>> {
    return await this.courseService.addMyCourses(userId, name, description, classCode)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  @Post('user/enroll-courses/add')
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