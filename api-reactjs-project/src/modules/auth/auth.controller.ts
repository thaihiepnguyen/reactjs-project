import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./auth.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";


@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    const {fullname, email, password} = registerDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return {
        message: 'User already exists'
      }
    }

    const SALT = '$2b$10$Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3';
    const encryptedPassword = await bcrypt.hash(password, SALT);

    await this.userService.createUser(fullname, email, encryptedPassword);
    return {
      message: 'User created successfully'
    }
  }
}