import {Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards} from "@nestjs/common";
import {Role} from "../auth/roles/role.enum";
import {Roles} from "../auth/roles/roles.decorator";
import {CourseService} from "./course.service";
import {MetaDataAuth} from "../auth/auth.decorator";
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
    const courses = await this.courseService.getMyCourses(userId)
    return {
      message: 'Get my courses successfully',
      data: courses,
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
  ): Promise<TBaseDto<any>> {
    const enrolledData = await this.courseService.enrollCourse(userId, classCode)

    return {
      message: enrolledData.msg,
      data: enrolledData?.data,
      statusCode: enrolledData?.status === true ? 201 : 400,
    }; 
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Put('remove/:id')
  async removeCourse(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<TBaseDto<null>> {
    return this.courseService.removeCourse(userId, id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Put('un-enroll/:id')
  async unenrollCourse(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<TBaseDto<null>> {
    return this.courseService.unenrollCourse(userId, id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student, Role.Teacher)
  @Get('user/my-courses/detail/:id')
  async getMyCourseDetail(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<TBaseDto<any>> {
    return this.courseService.getMyCourseDetail(id, userId)
  }
}