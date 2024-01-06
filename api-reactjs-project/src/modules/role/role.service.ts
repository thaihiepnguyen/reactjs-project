import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import * as argon from 'argon2';
import { Roles } from 'src/typeorm/entity/Roles';


@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  public async getRoleId(roleName: string): Promise<number> {
    const rawData = await this.roleRepository.findOne({
      where: {
        name: roleName
      }
    })
    const id = rawData?.id || null;
    return id;
  }

  public async getRole(id: number): Promise<Roles> {
    const rawData = await this.roleRepository.findOne({
      where: {
        id: id
      }
    })
    return rawData;
  }
}
