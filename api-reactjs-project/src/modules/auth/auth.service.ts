import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "./auth.dto";
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
  async create(createUserDto: CreateUserDto): Promise<any> {
    // console.log(await import('../../typeorm/entity/'))
    // const {username, password, email} = createUserDto;
    //
    // const user = this.userRepository.create(createUserDto);
    // await this.userRepository.save(user)


    return await this.roleRepository.findOne({
        where: {
          name: 'admin'
        }
    }
    )
  }
}