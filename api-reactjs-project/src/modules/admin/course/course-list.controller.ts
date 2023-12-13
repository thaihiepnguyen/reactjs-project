import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { CourseListService } from "./course-list.service";
import { TBaseDto } from "src/app.dto";
import { CourseService } from "src/modules/course/course.service";



@Controller('/admin/course')
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
}