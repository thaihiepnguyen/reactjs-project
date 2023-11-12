import {Injectable} from "@nestjs/common";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Roles, Users} from "../../typeorm";
import {InsertResult, QueryResult, Repository} from "typeorm";
import {Connection} from "mysql2/index";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectConnection()
    private readonly connection: Connection
  ) {}
  async findUserByEmail(email: string): Promise<Users | undefined> {
    return await this.userRepository.findOne(
      {
        where: {email}
      }
    );
  }

  async createUser(fullname: string, email: string, password: string): Promise<InsertResult> {
    return await this.userRepository.createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {fullname, email, password}
      ])
      .execute();
  }

  async createOrUpdateUser(fullname: string, email: string, avatar: string): Promise<Users> {
    let user = await this.userRepository.findOne({
      where: {email}
    })
    if (user) {
      if (!user.avatarUrl) {
        await this.userRepository.update(user.id, {
          avatarUrl: avatar,
          isActive: true
        })
      }
      return user;
    } else {
      return await this.userRepository.save({
        fullname, email, password: '', avatarUrl: avatar, isActive: true
      })
    }
  }

  async findUserById(id: number): Promise<Users | undefined> {
    return await this.userRepository.findOne(
      {
        where: {id},
        select: ['id', 'fullname', 'email', 'avatarUrl']
      },
    );
  }
}