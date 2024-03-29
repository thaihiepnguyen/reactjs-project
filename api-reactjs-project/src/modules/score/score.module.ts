import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { CourseModule } from '../course/course.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService],
  imports: [CourseModule, NotificationModule],
})
export class ScoreModule {}
