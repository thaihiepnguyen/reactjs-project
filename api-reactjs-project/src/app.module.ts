import {DynamicModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "./typeorm";
import {AuthMiddleware} from "./middlewares/auth.middleware";
@Module({})
export class AppModule implements NestModule {
  static forRoot(modules): DynamicModule {
    return {
      module: AppModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root', // your username
          password: 'reallyStrongPwd123', // your password
          database: 'QLHSSV_DB', // name of database
          entities,
        }),
        ...modules
      ]
    }
  }
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'user/profile',
        '/home',
        '/auth/create')
  }
}
