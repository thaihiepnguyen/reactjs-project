import {Injectable} from "@nestjs/common";
import {Users} from "../../typeorm";
import {Repository} from "typeorm";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Connection} from "mysql2";
import {Roles} from "../../typeorm/entity/Roles";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectConnection()
    private readonly connection: Connection
  ) {}
}