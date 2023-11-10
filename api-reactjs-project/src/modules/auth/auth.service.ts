import {Injectable} from "@nestjs/common";
import {Users} from "../../typeorm";
import {Repository} from "typeorm";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Connection} from "mysql2";
import {JwtService} from "@nestjs/jwt";
import * as argon from 'argon2';
import {MailerService} from "@nestjs-modules/mailer";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
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
    const html = `<p>Click the following link to verify your email: <a href="http://localhost:3001/auth/verify-email?token=${token.accessToken}">Verify Email</a></p>`;
    return await this.mailerService.sendMail({
      to: toEmail,
      from: 'thaihiep232002@gmail.com',
      subject: 'Verify Your Email',
      html: html,
    });
  }

  public async verifyEmail(token: string): Promise<any> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
      if (!payload) {
        return {
          message: 'Invalid token',
          status: 400
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      await this.userRepository.update(
        {email: payload.email},
        {isActive: true}
      );
    }
  }
}