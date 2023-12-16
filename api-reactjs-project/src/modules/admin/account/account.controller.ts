import {Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AccountService} from "./account.service";
import {ActiveAccountDto, AddAccountDto, UpdateAccountDto} from "./account.dto";
import {TBaseDto} from "../../../app.dto";
import {isNumber} from "@nestjs/common/utils/shared.utils";
import { Roles } from "src/modules/auth/roles/roles.decorator";
import { Role } from "src/modules/auth/roles/role.enum";
import { Users } from "src/typeorm/entity/Users";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UserService } from "src/modules/user/user.service";
import { unlink } from "fs";


@Controller('admin/account')
@Roles(Role.Admin)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService 
  ) { }

  @Post("create")
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
  async createUser(@UploadedFile() file: Express.Multer.File, @Body() createDto: AddAccountDto) {
    if (file) {
      createDto.avatarUrl = process.env.SERVER_URL + "/" + file.path;
    }
    const user = await this.userService.findUserByEmail(createDto.email);
    if (user) {
      if (file)
        await unlink(file.path, () => {});
      throw new HttpException("User's email already exists", 404);
    }
    createDto.isActive = createDto.isActive ? true : false;
    createDto.role = +createDto.role;
    const createdUser = await this.userService.adminCreateUser(createDto);
    return {
      statusCode: 200,
      data: createdUser,
      message: 'Created user successfully'
    };
  }

  @Get('all')
  async getAll(@Query('page', ParseIntPipe) page: number): Promise<TBaseDto<any>> {
    return {
      statusCode: 200,
      data: await this.accountService.getAll(page),
      message: 'Get all accounts successfully!'
    };
  }

  @Patch('active/:userId')
  async activeUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: ActiveAccountDto,
  ): Promise<TBaseDto<void>> {
    if (!isNumber(userId)) {
      return {
        statusCode: 400,
        message: 'User id must be a number!'
      }
    }
    if (userId < 0) {
      return {
        statusCode: 400,
        message: 'User id must be greater than 0!'
      }
    }
    const {isActive} = body;
    await this.accountService.activeUser(userId, isActive);

    return {
      statusCode: 200,
      message: 'Active user successfully!'
    }
  }

  @Put('update/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateAccountDto,
  ): Promise<TBaseDto<void>> {
    const {avatarUrl, fullname, email, roleId, password} = body;
    await this.accountService.updateUser(userId, avatarUrl, fullname, email, roleId, password);

    return {
      statusCode: 200,
      message: 'Update user successfully!'
    }
  }

  @Get('get/:userId')
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<TBaseDto<Users>> {
    const user = await this.accountService.getUserById(userId);
    return {
      statusCode: 200,
      data: user,
      message: 'Get user successfully!'
    }
  }

  @Post('mapping')
  async mappingExcel(@Body() items: {studentId: string, email: string}[]) {
    try {
      await this.accountService.mapping(items);
      return { message: 'Everything is updated' };
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  @Delete('/:userId')
  async blockAccount(@Param('userId', ParseIntPipe) userId: number,) {
    try {
      const res = await this.userService.blockUnblockUser(userId);
      return { message: res ? "Unblock user successfully" : "Block user successfully" };
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
  }

  @Get('/search')
  async search(
    @Query('page', ParseIntPipe) page: number,
    @Query('q') query: string,
  ): Promise<TBaseDto<any>> {
    return this.accountService.search(page, query);
  }
}