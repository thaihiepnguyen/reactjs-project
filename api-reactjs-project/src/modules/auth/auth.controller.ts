import {Body, Controller, Get, Post, Query, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto, RegisterDto} from "./auth.dto";
import { Response } from "express";
import {Cookies} from "../../app.decorator";
import {MetaDataAuth} from "./auth.decorator";
import {TBaseDto} from "../../app.dto";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response)
    : Promise<TBaseDto<any>> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<TBaseDto<any>> {
    const { message, data, statusCode } = await this.authService.login(loginDto);
    const { token, user } = data;
    response.cookie('token', token);
    response.cookie('userId', user.id);
    response.cookie('userName', user.fullname);
    delete user.password;
    return {
      message,
      data,
      statusCode
    }
  }

  @Get('refresh-token')
  async refreshToken(
    @MetaDataAuth('userId') userId: number,
    @Cookies('token') token: any,
    @Res({ passthrough: true }) response: Response
  ): Promise<TBaseDto<any>> {
    const {refreshToken} = token;

    const { message, data, statusCode } = await this.authService.refreshToken(userId, refreshToken);
    const { newToken, user } = data;

    response.cookie('token', newToken);
    response.cookie('userId', user.id)
    response.cookie('userName', user.fullname)

    return {
      message,
      statusCode,
    }
  }

  @Post('login-social')
  async loginSocial(@Body() loginSocialDto: any, @Res({ passthrough: true }) response: Response)
    : Promise<TBaseDto<any>> {
    const { message, data, statusCode } = await this.authService.loginSocial(loginSocialDto);

    const { token, user } = data;
    response.cookie('token', token);
    response.cookie('userId', user.id)
    response.cookie('userName', user.fullname)
    return {
      message,
      data,
      statusCode,
    }
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string
  ): Promise<TBaseDto<any>> {
    await this.authService.verifyEmail(token);
    return {
      message: 'success',
      statusCode: 200,
      data: undefined
    }
  }
}