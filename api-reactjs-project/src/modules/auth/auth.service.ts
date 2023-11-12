import {BadRequestException, HttpException, Injectable} from "@nestjs/common";
import {Users} from "../../typeorm";
import {Repository} from "typeorm";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Connection} from "mysql2";
import {JwtService} from "@nestjs/jwt";
import * as argon from 'argon2';
import {MailerService} from "@nestjs-modules/mailer";
import {TBaseDto} from "../../app.dto";
import * as bcrypt from "bcrypt";
import * as process from "process";
import {UserService} from "../user/user.service";
import {LoginDto, RegisterDto} from "./auth.dto";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  public async generateToken(payload: any)
    : Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h'
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '10d'
      })
    ]);

    await this.userRepository.update(
      {id: payload.id},
      {refreshToken: await argon.hash(refreshToken)}
    );

    return { accessToken, refreshToken };
  }

  public async sendMail(toEmail, token): Promise<any> {
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';
    const html = `<p>Click the following link to verify your email: <a href="${serverUrl}/auth/verify-email?token=${token.accessToken}">Verify Email</a></p>`;
    return await this.mailerService.sendMail({
      to: toEmail,
      from: process.env.USER_NODEMAILER,
      subject: 'Verify Your Email',
      html: html,
    });
  }

  public async verifyEmail(token: string): Promise<Boolean> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
      if (!payload) {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      await this.userRepository.update(
        {email: payload.email},
        {isActive: true}
      );
    }
    return true;
  }

  public async register(registerDto: RegisterDto)
    : Promise<TBaseDto<any>> {
    const {fullname, email, password} = registerDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return {
        message: 'User already exists'
      }
    }

    const SALT = process.env.SALT || 10;
    const encryptedPassword = await bcrypt.hash(password, SALT);

    await this.userService.createUser(fullname, email, encryptedPassword);
    const token = await this.generateToken(registerDto);

    await this.sendMail(email, token);
    return {
      message: 'User created successfully',
      statusCode: 200,
      data: undefined
    }
  }

  public async login(loginDto: LoginDto)
    : Promise<TBaseDto<any>> {
    const {email, password} = loginDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (!user.isActive) {
      throw new BadRequestException('Please verify your email first',
        { cause: new Error(), description: 'User is not active' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Please check your password',
        { cause: new Error(), description: 'Incorrect password' });
    }

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    return {
      message: 'success',
      data: {
        token: await this.generateToken(payload),
        user: user,
      },
      statusCode: 200
    };
  }

  public async refreshToken(userId: number, refreshToken: string): Promise<TBaseDto<any>> {
    const user = await this.userService.findUserById(userId);
    const isMatched = await argon.verify(user.refreshToken, refreshToken);
    if (!isMatched) throw new BadRequestException('Access Denied');
    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }
    const newToken = await this.generateToken(payload);
    return {
      message: 'success',
      statusCode: 200,
      data: {
        token: newToken,
        user: user,
      }
    }
  }

  public async loginSocial(loginSocialDto: any): Promise<TBaseDto<any>> {
    const {name: fullname, email, image:avatar} = loginSocialDto.user;
    const user = await this.userService.createOrUpdateUser(fullname, email, avatar );
    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }
    const token = await this.generateToken(payload);
    return {
      message: 'success',
      statusCode: 200,
      data: {
        token: token,
        user: user,
      }
    }
  }
}