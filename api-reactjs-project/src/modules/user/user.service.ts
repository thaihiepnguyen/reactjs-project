import {HttpException, Injectable} from "@nestjs/common";
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {InsertResult, QueryResult, Repository} from "typeorm";
import {Connection} from "mysql2/index";
import { UpdateProfileUserDto } from "./user.dto";
import { unlink } from "fs";
import { Users } from "src/typeorm/entity/Users";
import * as process from "process";
import { AddAccountDto } from "../admin/account/account.dto";
import * as bcrypt from "bcrypt";

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
        where: {
          email,
          isValid: true
        }
      }
    );
  }

  async createUser(fullname: string, email: string, password: string): Promise<Users> {
    const insertResult = await this.userRepository.createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {fullname, email, password}
      ])
      .execute();

    return (
      (insertResult?.['generatedMaps']?.[0] as Users) ||
      ({} as Users)
    )
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
    return await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: id })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
  }

  async updateUser(id:number, data: UpdateProfileUserDto) {
    id = id ? id : 0;
    let user = await this.userRepository.findOne({
      where: {
        id: id,
        email: data.email
      }
    })

    if(user) {
      if (data.avatarUrl && user.avatarUrl) {
        unlink(user.avatarUrl, () => {});
      }
      await this.userRepository.update(user.id, {
        avatarUrl: data.avatarUrl,
        fullname: data.fullname,
        phone: data.phone
      })
      return await this.userRepository.findOne({
        where: {
          id: user.id, 
        }
      })
    }
    return null;
  }

  async blockUnblockUser(id:number) {
    id = id ? id : 0;
    let user = await this.userRepository.findOne({
      where: {
        id: id,
      }
    })

    if(user) {
      await this.userRepository.update(user.id, {
        isValid: !user.isValid
      })
      return user.isValid ? false : true;
    } else {
      throw new HttpException('User not found', 404);
    }
  }

  async updateUserPassword(email: string, newPassword: string): Promise<Users | undefined> {
    let user = await this.userRepository.findOne({
      where: {email}
    })
    // console.log(user);
    if (!user) {
      // Handle case where the user does not exist
      return undefined;
    } else {
      await this.userRepository.update((await user).id, {
        password: newPassword
      });
      
      return user;
    }
  }

  async adminCreateUser(user: AddAccountDto): Promise<Users> {
    const SALT = process.env.SALT || 10;
    const encryptedPassword = await bcrypt.hash(user.password, SALT);

    const insertResult = await this.userRepository.createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          fullname: user.fullname,
          email: user.email,
          password: encryptedPassword,
          avatarUrl: user?.avatarUrl,
          isActive: user.isActive,
          roleId: user.role
        }
      ])
      .execute();
    return (
      (insertResult?.['generatedMaps']?.[0] as Users) ||
      ({} as Users)
    )
  }
}