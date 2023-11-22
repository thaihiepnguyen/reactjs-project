import {Module} from "@nestjs/common";
import {AccountController} from "./account.controller";
import {AccountService} from "./account.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../../../typeorm";
import {UserService} from "../../user/user.service";


@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AccountController],
  providers: [AccountService, UserService],
  exports: []
})
export class AccountModule {}