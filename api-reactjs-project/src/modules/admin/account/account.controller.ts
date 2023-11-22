import {Body, Controller, Get, Param, ParseIntPipe, Patch, Put} from "@nestjs/common";
import {AccountService} from "./account.service";
import {Users} from "../../../typeorm";
import {ActiveAccountDto, UpdateAccountDto} from "./account.dto";
import {TBaseDto} from "../../../app.dto";
import {isNumber} from "@nestjs/common/utils/shared.utils";

@Controller('admin/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {
  }
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
}