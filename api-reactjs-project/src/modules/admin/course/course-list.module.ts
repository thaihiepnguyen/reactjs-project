import { Module } from '@nestjs/common';
import { CourseListController } from './course-list.controller';
import { CourseListService } from './course-list.service';
import { CourseService } from 'src/modules/course/course.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [CourseListController],
  providers: [CourseListService, CourseService],
  imports: [AuthModule],
})
export class CourseListModule {}
