import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../../user/user.service";
import * as process from "process";
import * as bcrypt from "bcrypt";
import { Users } from "src/typeorm/entity/Users";


@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly userService: UserService
  ) {}

  async getAll(): Promise<Users[]> {
    return this.userRepository.find({
      select: {
        fullname: true,
        email: true,
        isActive: true,
        avatarUrl: true,
        roleId: true,
      },
      where: {
        isValid: true
      }
    });
  }

  async activeUser(userId: number, isActive: boolean): Promise<void> {
    const user = await this.userService.findUserById(userId)
    if(!user) {
      throw new HttpException('User not found!', 404);
    }

    await this.userRepository.update({id: userId}, {isActive: isActive});
  }

  async updateUser(
    userId: number,
    avatarUrl?: string,
    fullname?: string,
    email?: string,
    roleId?: number,
    password?: string) {
    let encryptedPassword
    if (password) {
      const SALT = process.env.SALT || 10;
      encryptedPassword = await bcrypt.hash(password, SALT);
    }

    await this.userRepository.update({id: userId}, {
      avatarUrl,
      fullname,
      email,
      roleId,
      password: encryptedPassword
    })
  }

  async getUserById(userId: number) {
    return this.userService.findUserById(userId)
  }

  async mapping(items: {studentId: string, email: string}[]) {
    for (const item of items) {
      const { studentId, email } = item;
     
      // Check if the email exists in the database
      const existingUser = await this.userRepository.findOne({ where: { email } });
  
      if (existingUser) {
        await this.userRepository.update((await existingUser).id, {
          studentId: studentId
        });

      } else {
        // Handle scenario where the email doesn't exist in the database
        // You might want to log this or handle it as per your application's logic
        console.log(`Email ${email} not found in the database.`);
      }
    }
  }
}