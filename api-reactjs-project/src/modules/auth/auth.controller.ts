import {Body, Controller, ForbiddenException, Get, Post, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto, RegisterDto} from "./auth.dto";
import {UserService} from "../user/user.service";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import {Cookies} from "../../app.decorator";
import {MetaDataAuth} from "./auth.decorator";
import * as argon from 'argon2';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
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


  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    const {email, password} = loginDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return {
        message: 'User not found'
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        message: 'Incorrect password'
      }
    }

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    const token = await this.authService.generateToken(payload);
    response.cookie('token', token);
    response.cookie('userId', user.id)
    response.cookie('userName', user.fullname)
    delete user.password;
    return {
      message: 'success',
      token: token,
      user: user,
    }
  }

  @Get('refresh-token')
  async refreshToken(
    @MetaDataAuth('userId') userId: number,
    @Cookies('token') token: any,
    @Res({ passthrough: true }) response: Response
  ): Promise<any> {
    const {refreshToken} = token;

    const user = await this.userService.findUserById(userId);

    const isMatched = await argon.verify(user.refreshToken, refreshToken);
    if (!isMatched) throw new ForbiddenException('Access Denied');

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    const newToken = await this.authService.generateToken(payload);
    response.cookie('token', newToken);

    return {
      message: 'success'
    }
  }

  @Post('login-social')
  async loginSocial(@Body() loginSocialDto: any, @Res({ passthrough: true }) response: Response): Promise<any> {
    const {name: fullname, email, image:avatar} = loginSocialDto.user;
    const user = await this.userService.createOrUpdateUser(fullname, email, avatar );

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    const token = await this.authService.generateToken(payload);
    response.cookie('token', token);
    response.cookie('userId', user.id)
    response.cookie('userName', user.fullname)
    return {
      message: 'success',
      token: token,
      user: user,
    }
  }
}