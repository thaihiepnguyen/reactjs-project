import { Controller, Get } from "@nestjs/common";
import { Role } from "../auth/roles/role.enum";
import { Roles } from "../auth/roles/roles.decorator";


@Controller('courses')
export class CourseController {
  @Get('all/:userId/student-courses')
  getAllStudentCourses() {
    return 'All courses';
  }

  @Roles(Role.Teacher)
  @Get('all/:teacher/teacher-courses')
  getAllTeacherCourses() {
    return 'All courses';
  }
}