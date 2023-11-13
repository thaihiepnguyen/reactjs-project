import {Body, Controller, Post, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import {Get} from "@nestjs/common";
import {MetaDataAuth} from "../auth/auth.decorator";
import {UserService} from "./user.service";
import { UpdateProfileUserDto } from "./user.dto";
import { TBaseDto } from "src/app.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,) {
  }
  @Get('profile')
  getProfile(@MetaDataAuth('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @Post('profile')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads'
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async register(@UploadedFile() file: Express.Multer.File, @Body() updateDto: UpdateProfileUserDto, @Res({ passthrough: true }) response: Response) {
    console.log(file);
  }
}