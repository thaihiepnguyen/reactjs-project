import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { MetaDataAuth } from '../auth/auth.decorator';
import { UserService } from './user.service';
import { UpdateProfileUserDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlink } from 'fs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@MetaDataAuth('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @MetaDataAuth('userId') userId: number,
    @Body() updateDto: UpdateProfileUserDto,
  ) {
    if (file) {
      updateDto.avatarUrl = process.env.SERVER_URL + '/' + file.path;
    }
    const user = await this.userService.updateUser(userId, updateDto);
    if (!user && file) {
      await unlink(file.path, () => {});
      throw new HttpException('User not found', 404);
    } else {
      return {
        message: 'success',
        data: {
          user: user,
        },
        statusCode: 200,
      };
    }
  }
}
