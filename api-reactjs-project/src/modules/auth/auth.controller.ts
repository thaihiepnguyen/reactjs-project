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
    const { user } = data;
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

    return await this.authService.refreshToken(userId, refreshToken);
  }

  @Post('login-social')
  async loginSocial(@Body() loginSocialDto: any, @Res({ passthrough: true }) response: Response)
    : Promise<TBaseDto<any>> {
    return await this.authService.loginSocial(loginSocialDto);
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string
  ): Promise<TBaseDto<any>> {
    const isValid = await this.authService.verifyEmail(token);
    if (!isValid) throw new Error('Invalid token');
    return {
      message: 'success',
      statusCode: 200,
      data: undefined
    }
  }
}