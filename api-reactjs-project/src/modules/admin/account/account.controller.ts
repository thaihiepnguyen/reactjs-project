import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards} from "@nestjs/common";
import {AccountService} from "./account.service";
import {ActiveAccountDto, UpdateAccountDto} from "./account.dto";
import {TBaseDto} from "../../../app.dto";
import {isNumber} from "@nestjs/common/utils/shared.utils";
import { RolesGuard } from "src/modules/auth/roles/roles.guard";
import { Roles } from "src/modules/auth/roles/roles.decorator";
import { Role } from "src/modules/auth/roles/role.enum";
import { Users } from "src/typeorm/entity/Users";


// @UseGuards(RolesGuard)
@Controller('admin/account')
@Roles(Role.Admin)
export class AccountController {
  constructor(private readonly accountService: AccountService) { }
  @Get('all')
  async getAll(): Promise<TBaseDto<Users[]>> {
    return {
      statusCode: 200,
      data: await this.accountService.getAll(),
      message: 'Get all account successfully!'
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
}