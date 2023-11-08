import {Injectable} from "@nestjs/common";
import {Users} from "../../typeorm";
import {Repository} from "typeorm";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Connection} from "mysql2";
import {JwtService} from "@nestjs/jwt";
import * as argon from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectConnection()
    private readonly connection: Connection,
    private jwtService: JwtService
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
}