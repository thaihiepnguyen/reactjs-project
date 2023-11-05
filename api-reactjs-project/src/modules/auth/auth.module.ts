import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Roles, Users} from "../../typeorm";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}