import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "./typeorm";
import {AuthModule} from "./modules/auth/auth.module";
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // your username
    password: 'reallyStrongPwd123', // your password
    database: 'QLHSSV_DB', // name of database
    entities,
  }), AuthModule],
})
export class AppModule {}
