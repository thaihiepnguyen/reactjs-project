import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
  imports: [AuthModule],
})
export class CourseModule {}
