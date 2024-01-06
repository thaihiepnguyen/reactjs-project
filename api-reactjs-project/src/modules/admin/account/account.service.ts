import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserService } from '../../user/user.service';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/typeorm/entity/Users';
import { TBaseDto } from 'src/app.dto';

const PAGING_LIMIT = 15;
@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getAll(page: number): Promise<any> {
    const offset = (page - 1) * PAGING_LIMIT;

    const [list, count] = await Promise.all([
      this.connection.getRepository(Users).find({
        select: {
          id: true,
          fullname: true,
          email: true,
          isActive: true,
          avatarUrl: true,
          roleId: true,
          isValid: true,
          studentId: true,
        },
        take: PAGING_LIMIT,
        skip: offset,
      }),
      this.connection.getRepository(Users).count(),
    ]);

    return {
      list,
      currentPage: page,
      totalItem: count,
      totalPage:
        Math.floor(count / PAGING_LIMIT) === count / PAGING_LIMIT
          ? count / PAGING_LIMIT
          : Math.floor(count / PAGING_LIMIT) + 1,
      size: list.length,
    };
  }

  async activeUser(userId: number, isActive: boolean): Promise<void> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found!', 404);
    }

    await this.connection
      .getRepository(Users)
      .update({ id: userId }, { isActive: isActive });
  }

  async updateUser(
    userId: number,
    avatarUrl?: string,
    fullname?: string,
    email?: string,
    roleId?: number,
    password?: string,
  ) {
    let encryptedPassword;
    if (password) {
      const SALT = process.env.SALT || 10;
      encryptedPassword = await bcrypt.hash(password, SALT);
    }

    await this.connection.getRepository(Users).update(
      { id: userId },
      {
        avatarUrl,
        fullname,
        email,
        roleId,
        password: encryptedPassword,
      },
    );
  }

  async getUserById(userId: number) {
    return this.userService.findUserById(userId);
  }

  async mapping(items: { studentId: string; email: string }[]) {
    const runner = this.connection.createQueryRunner();
    try {
      for (const item of items) {
        const { studentId, email } = item;

        // Check if the email exists in the database
        const [existedUser, isStudentIdExisted] = await Promise.all([
          await runner.manager
            .getRepository(Users)
            .findOne({ where: { email } }),
          await runner.manager.getRepository(Users).exist({
            where: {
              studentId: studentId,
            },
          }),
        ]);

        if (existedUser && isStudentIdExisted) {
          await runner.manager.getRepository(Users).update(existedUser.id, {
            studentId: studentId,
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      await runner.release();
    }
  }

  async search(page: number, query: string): Promise<TBaseDto<any>> {
    const sql = `
    SELECT 
      id,
      fullname,
      email,
      is_active as isActive,
      avatar_url as avatarUrl,
      role_id as roleId,
      is_valid as isValid,
      student_id
    FROM users 
    WHERE MATCH(fullname) AGAINST (?)
    LIMIT ?
    OFFSET ?;
    `;
    const offset = (page - 1) * PAGING_LIMIT;
    const [list, countRaw] = await Promise.all([
      this.connection.query(sql, [query, PAGING_LIMIT, offset]),
      this.connection.query(
        'SELECT COUNT(*) as count FROM users WHERE MATCH(fullname) AGAINST (?)',
        [query],
      ),
    ]);

    const count = +countRaw[0]['count'];

    return {
      message: 'success',
      statusCode: 200,
      data: {
        list,
        currentPage: page,
        totalItem: count,
        totalPage:
          Math.floor(count / PAGING_LIMIT) === count / PAGING_LIMIT
            ? count / PAGING_LIMIT
            : Math.floor(count / PAGING_LIMIT) + 1,
        size: list.length,
      },
    };
  }
}
