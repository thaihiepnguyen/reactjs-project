import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserService } from '../../user/user.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, UserService],
  exports: [],
})
export class AccountModule {}
