import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Roles, Users} from "../../typeorm";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }