import { Controller, Get } from "@nestjs/common";
import { Role } from "../auth/roles/role.enum";
import { Roles } from "../auth/roles/roles.decorator";
import { CourseService } from "./course.service";
import { MetaDataAuth } from "../auth/auth.decorator";


@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get('user/my-courses')
  @Roles(Role.Student, Role.Teacher)
  async getMyCourses(@MetaDataAuth('userId') userId: number) {
    return this.courseService.getMyCourses(userId);
  }
}