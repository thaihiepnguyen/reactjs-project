import {Module} from "@nestjs/common";
import {AccountController} from "./account.controller";
import {AccountService} from "./account.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserService} from "../../user/user.service";
import { Users } from "src/typeorm/entity/Users";


@Module({
  controllers: [AccountController],
  providers: [AccountService, UserService],
  exports: []
})
export class AccountModule {}