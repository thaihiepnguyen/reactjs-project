import { Body, Controller, Get, Param, ParseIntPipe, Put, Query } from "@nestjs/common";
import { CourseListService } from "./course-list.service";
import { TBaseDto } from "src/app.dto";
import { Roles } from "src/modules/auth/roles/roles.decorator";
import { Role } from "src/modules/auth/roles/role.enum";



@Controller('/admin/course')
@Roles(Role.Admin)
export class CourseListController {
  constructor(
    private readonly courseListSerivce: CourseListService,
  ) {}

  @Get('/all')
  async getAll(@Query('page', ParseIntPipe) page: number): Promise<TBaseDto<any>> {
    return {
      statusCode: 200,
      data: await this.courseListSerivce.getAll(page),
      message: 'Get all courses successfully!'
    };
  }

  @Get('/search')
  async search(
    @Query('page', ParseIntPipe) page: number,
    @Query('q') query: string,
  ): Promise<TBaseDto<any>> {
    return this.courseListSerivce.search(page, query);
  }

  @Put('/putActive/:courseId')
  async active(
    @Body('isActive') isActive: boolean,
    @Param('courseId', ParseIntPipe) courseId: number
  ): Promise<TBaseDto<null>> {
    return this.courseListSerivce.putActive(courseId, isActive);
  }
}