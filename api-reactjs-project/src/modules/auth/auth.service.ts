import {BadRequestException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Connection} from "typeorm";
import {InjectConnection} from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt";
import * as argon from 'argon2';
import {MailerService} from "@nestjs-modules/mailer";
import {TBaseDto} from "../../app.dto";
import * as bcrypt from "bcrypt";
import * as process from "process";
import {UserService} from "../user/user.service";
import {RoleService} from "../role/role.service";
import {RegisterDto} from "./auth.dto";
import { Users } from "src/typeorm/entity/Users";


@Injectable()
export class AuthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) { throw new HttpException('Email not exists', HttpStatus.FORBIDDEN)}

    if (!user.isActive) { throw new HttpException('User is not active', HttpStatus.FORBIDDEN) }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) { throw new HttpException('Password not correct', HttpStatus.FORBIDDEN) }

    delete user.password;
    return user;
  }

  public async generateToken(payload): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '24h'
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '10d'
      })
    ]);

    await this.connection.getRepository(Users).update(
      {id: payload.id},
      {refreshToken: await argon.hash(refreshToken)}
    );

    return { accessToken, refreshToken };
  }

  public async getRole(userid: number): Promise<any> {
    return await this.connection.getRepository(Users).createQueryBuilder("user").where("user.id = :id", { id: userid }).leftJoinAndSelect('user.role', 'role').getOne();
  }

  public async sendMail(toEmail, token, payload): Promise<any> {
    const { fullname } = payload;

    const rawData = await this.connection.query(`SELECT * FROM email_templates WHERE id = 1`);
    const content = rawData[0].content;
    const html = content.replace('$user_name$', fullname).replace('$token$', token.accessToken).replace("$url$", process.env.CLIENT_URL);

    return this.mailerService.sendMail({
      to: toEmail,
      from: process.env.USER_NODEMAILER, 
      subject: 'Verify Your Email',
      html: html,
    });
  }

  public async sendResetPasswordMail(toEmail, token, payload, url): Promise<any> {
    const { fullname } = payload;
    // console.log("send email");
    const rawData = await this.connection.query(`SELECT * FROM email_templates WHERE id = 2`);
    const content = rawData[0].content;
    const html = content.replace('$user_name$', fullname).replace('$token$', token).replace('$url$', url).replace('$email$', toEmail);

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
      await this.connection.getRepository(Users).update(
        {id: payload.id},
        {isActive: true}
      );
    }
    return true;
  }

  public async register(registerDto: RegisterDto)
    : Promise<TBaseDto<undefined>> {
    const {fullname, email, password, role} = registerDto;
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return { message: 'User already exists' }
    }

    const SALT = process.env.SALT || 10;
    const encryptedPassword = await bcrypt.hash(password, SALT);

    const userDB = await this.userService.createUser(fullname, email, encryptedPassword);

    const roleId = await this.roleService.getRoleId(role);

    const payload = {
      id: userDB.id,
      fullname: fullname,
      email: email,
      roleId: roleId || 1,
    }

    const tokenKey = await this.generateToken(payload);

    await this.sendMail(email, tokenKey, payload);
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
    const role = await this.roleService.getRole(user.roleId);
    user.role = role;
    
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

  public async forgotPassword(email: string): Promise<TBaseDto<any>> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return { message: 'User with this email does not exist' };
    }

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    const [token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '24h'
      }),
    ]);

    try {
      await this.sendResetPasswordMail(email, token, payload, process.env.CLIENT_URL);
      return { message: 'send reset password email successfully!' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { message: 'Failed to send password reset email' };
    }
  }

  private async generateResetToken(user: Users): Promise<string> {
    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    }

    // Generate a unique reset token (you can use UUID or any token generation library)
    const resetToken = this.generateToken(payload);
    // Save the reset token associated with the user (in database or cache)
    return resetToken;
  }

  public async updateUserPassword(token: string, password: string) {
    this.jwtService.verifyAsync(token)
    .then(async (response) => {
      const SALT = process.env.SALT || 10;
      const encryptedPassword = await bcrypt.hash(password, SALT);
      const updatedUser = await this.userService.updateUserPassword(response.email, encryptedPassword);
      if (!updatedUser) {
        return { message: 'Failed to update password' };
      }
      return { message: 'Change password successfully' };
    })
    .catch((error) => {
      throw new HttpException("Cannot validate token", 404)
    })
  }
}