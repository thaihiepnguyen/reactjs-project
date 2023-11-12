import {Controller} from "@nestjs/common";
import {Get} from "@nestjs/common";
import {MetaDataAuth} from "../auth/auth.decorator";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,) {
  }
  @Get('profile')
  getProfile(@MetaDataAuth('userId') userId: number) {
    return this.userService.findUserById(userId);
  }
}