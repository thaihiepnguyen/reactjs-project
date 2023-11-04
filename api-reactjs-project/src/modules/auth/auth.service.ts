import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "./auth.dto";
import {Users} from "../../typeorm";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<void> {
    const {username, password, email} = createUserDto;

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user)
  }
}