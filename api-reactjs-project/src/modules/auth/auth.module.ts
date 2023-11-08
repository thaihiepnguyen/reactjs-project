import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Roles, Users} from "../../typeorm";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles]),
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: {
        expiresIn: '1h'
      }
    })],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}