import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {NotificationService} from "./notification.service";
import {RolesGuard} from "../auth/roles/roles.guard";
import {Role} from "../auth/roles/role.enum";
import {Roles} from "../auth/roles/roles.decorator";
import {TBaseDto} from "../../app.dto";
import {MetaDataAuth} from "../auth/auth.decorator";

@Controller('noti')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Post('teacher/push/allCourses')
  async pushAllCourses(
    @Body('message') message: string,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<any>> {
    await this.notificationService.pushAllCourse(userId, message)
    return {
      message: 'success',
      statusCode: 200,
      data: null
    }
  }

  @Post('test')
  async pushTest(
    @Body('message') message: string,
  ) {
    await this.notificationService.pushAllCourse(61, message)
    return 'OK'
  }
}