import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSocialDto, RegisterDto } from './auth.dto';
import { Cookies } from '../../app.decorator';
import { MetaDataAuth } from './auth.decorator';
import { TBaseDto } from '../../app.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './guards/public.guard';
import * as process from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TBaseDto<any>> {
    return await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<TBaseDto<any>> {
    const { user } = req;
    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roleId: user.roleId,
    };
    const role = await this.authService.getRole(user.id);
    user.role = role?.role;

    return {
      message: 'success',
      statusCode: 200,
      data: {
        token: await this.authService.generateToken(payload),
        user: user,
      },
    };
  }

  @Get('refresh-token')
  async refreshToken(
    @MetaDataAuth('userId') userId: number,
    @Cookies('token') token: any,
  ): Promise<TBaseDto<any>> {
    const { refreshToken } = token;
    return await this.authService.refreshToken(userId, refreshToken);
  }

  @Post('login-social')
  async loginSocial(
    @Body() loginSocialDto: LoginSocialDto,
    @Request() req,
  ): Promise<TBaseDto<any>> {
    return await this.authService.loginSocial(loginSocialDto);
  }

  @Render('email')
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<any> {
    const isValid = await this.authService.verifyEmail(token);
    if (!isValid) throw new Error('Invalid token');
    return {
      message: 'success',
      url: process.env.CLIENT_URL,
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string },
  ): Promise<TBaseDto<any>> {
    return await this.authService.forgotPassword(body.email);
  }

  @Render('forgot-password-email')
  @Get('verify-email-forgot-password')
  async verifyEmailForgotPassword(
    @Query('token') token: string,
  ): Promise<TBaseDto<any>> {
    const isValid = await this.authService.verifyEmail(token);
    if (!isValid) throw new Error('Invalid token');
    return {
      message: 'success',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return await this.authService.updateUserPassword(body.token, body.password);
  }
}
