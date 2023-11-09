import {Controller} from "@nestjs/common";
import {Get} from "@nestjs/common";
import {MetaDataAuth} from "../auth/auth.decorator";

@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(
    @MetaDataAuth('userId') userId: number)
  {
    console.log(typeof userId);
    return 'profile';
  }
}