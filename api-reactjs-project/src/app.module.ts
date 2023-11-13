import {DynamicModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "./typeorm";
import {AuthMiddleware} from "./modules/auth/auth.middleware";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule} from "@nestjs/config";
import * as process from "process";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({})
export class AppModule implements NestModule {
  static forRoot(modules): DynamicModule {
    return {
      module: AppModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_ADDON_HOST,
          port: +process.env.MYSQL_ADDON_PORT,
          username: process.env.MYSQL_ADDON_USER,
          password: process.env.MYSQL_ADDON_PASSWORD,
          database: process.env.MYSQL_ADDON_DB,
          entities,
        }),
        MailerModule.forRoot({
          transport: {
            host: process.env.HOST_NODEMAILER,
            auth: {
              user: process.env.USER_NODEMAILER,
              pass: process.env.PASS_NODEMAILER
            }
          }
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: '/uploads/'
        }),
        ...modules
      ]
    }
  }
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'user/profile'
      )
  }
}
