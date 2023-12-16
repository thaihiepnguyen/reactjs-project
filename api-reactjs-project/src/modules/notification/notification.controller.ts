import {Body, Controller, Get, ParseIntPipe, Post, UseGuards} from "@nestjs/common";
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
    @Body('title') title: string,
    @Body('message') message: string,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<any>> {
    await this.notificationService.pushAllCourses(userId, message, title)
    return {
      message: 'success',
      statusCode: 200,
      data: null
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Teacher)
  @Post('teacher/push/courses')
  async pushCourses(
    @Body('title') title: string,
    @Body('content') message: string,
    @Body('id', ParseIntPipe) id: number,
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<any>> {
    await this.notificationService.pushCourses(id, userId, message, title)
    return {
      message: 'success',
      statusCode: 200,
      data: null
    }
  }

  @Get('student')
  async getNotifications(
    @MetaDataAuth('userId') userId: number
  ): Promise<TBaseDto<any>> {
    return this.notificationService.getNotifications(userId)
  }
}