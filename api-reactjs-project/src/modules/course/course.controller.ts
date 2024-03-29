import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '../auth/roles/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { CourseService } from './course.service';
import { MetaDataAuth } from '../auth/auth.decorator';
import { TBaseDto } from '../../app.dto';
import { EnrolledCoursesResponse, MyCoursesResponse } from './course.typing';
import { RolesGuard } from '../auth/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('user/enrolled-courses')
  async getEnrolledCourses(
    @MetaDataAuth('userId') userId: number,
  ): Promise<TBaseDto<EnrolledCoursesResponse[]>> {
    return {
      message: 'Get enrolled courses successfully',
      data: await this.courseService.getEnrolledCourses(userId),
      statusCode: 200,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Get('user/my-courses')
  async getMyCourses(
    @MetaDataAuth('userId') userId: number,
  ): Promise<TBaseDto<MyCoursesResponse[]>> {
    const courses = await this.courseService.getMyCourses(userId);
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
    return await this.courseService.addMyCourses(
      userId,
      name,
      description,
      classCode,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher, Role.Student)
  @Post('user/enroll-courses/add')
  async enrollCourse(
    @MetaDataAuth('userId') userId: number,
    @Body('classCode') classCode: string,
  ): Promise<TBaseDto<any>> {
    const enrolledData = await this.courseService.enrollCourse(
      userId,
      classCode,
    );

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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TBaseDto<null>> {
    return this.courseService.removeCourse(userId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student)
  @Put('un-enroll/:id')
  async unenrollCourse(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TBaseDto<null>> {
    return this.courseService.unenrollCourse(userId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student, Role.Teacher)
  @Get('user/my-courses/detail/:id')
  async getMyCourseDetail(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TBaseDto<any>> {
    return this.courseService.getMyCourseDetail(id, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Delete('ban-student/:id/from/:courseId')
  async banStudent(
    @MetaDataAuth('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<TBaseDto<null>> {
    return this.courseService.banStudent(userId, id, courseId);
  }

  @Post('invite') //Public for everyone
  async inviteToCourse(
    @Body('emails') emails: string[],
    @Body('courseId') courseId: string,
  ): Promise<TBaseDto<any>> {
    return this.courseService.inviteToCourse(emails, courseId);
  }

  @Post('/upload/template/file')
  @UseInterceptors(
    FileInterceptor('course', {
      storage: diskStorage({
        destination: './uploads/template',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @MetaDataAuth('userId') userId: number,
  ) {
    if (file) {
      return this.courseService.saveStudentList(file, userId);
    } else {
      return {
        message: 'upload file failed!',
        statusCode: 400,
        data: null,
      };
    }
  }
}
