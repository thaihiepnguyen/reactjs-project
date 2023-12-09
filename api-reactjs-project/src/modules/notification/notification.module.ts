import {Module} from "@nestjs/common";
import {NotificationService} from "./notification.service";
import {GatewayModule} from "../gateway/gateway.module";
import {CourseModule} from "../course/course.module";
import {NotificationController} from "./notification.controller";
import {UserModule} from "../user/user.module";


@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [GatewayModule, CourseModule, UserModule]
})
export class NotificationModule { }