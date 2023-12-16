import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./passport/local.strategy";
import { Users } from "src/typeorm/entity/Users";
import { Roles } from "src/typeorm/entity/Roles";
import { RoleService } from "../role/role.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles]),
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: {
        expiresIn: '24h'
      }
    }), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, RoleService],
})
export class AuthModule {}