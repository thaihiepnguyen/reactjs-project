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
import {RegisterDto} from "./auth.dto";


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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) { return null; }

    if (!user.isActive) { return null; }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) { return null; }

    delete user.password;
    return user;
  }

  public async generateToken(payload): Promise<any> {
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
    return this.mailerService.sendMail({
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
        {id: payload.id},
        {isActive: true}
      );
    }
    return true;
  }

  public async register(registerDto: RegisterDto)
    : Promise<TBaseDto<undefined>> {
    const {fullname, email, password} = registerDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return { message: 'User already exists' }
    }

    const SALT = process.env.SALT || 10;
    const encryptedPassword = await bcrypt.hash(password, SALT);

    const userDB = await this.userService.createUser(fullname, email, encryptedPassword);

    const payload = {
      id: userDB.id,
      fullname: userDB.fullname,
      email: userDB.email,
    }

    const tokenKey = await this.generateToken(payload);

    await this.sendMail(email, tokenKey);
    return {
      message: 'User created successfully',
      statusCode: 200,
      data: undefined
    }
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