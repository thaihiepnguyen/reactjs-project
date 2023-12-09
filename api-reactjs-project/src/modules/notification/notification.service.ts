import {Injectable} from "@nestjs/common";
import {GatewayService} from "../gateway/gateway.service";
import {CourseService} from "../course/course.service";
import {UserService} from "../user/user.service";

@Injectable()
export class NotificationService {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly courseService: CourseService,
    private readonly userService: UserService
  ) { }
  async pushAllCourse(teacherId: number, message: string) {
    const courses = await this.courseService.getMyCourses(teacherId);
    const user = await this.userService.findUserById(teacherId)
    const rooms = courses.map(item => (`room-${item.id}`));

    const payload = {
      avatarUrl: user.avatarUrl,
      userName: user.fullname,
      message: message,
    }
    this.gatewayService.pushNotification(rooms, payload)
  }
}