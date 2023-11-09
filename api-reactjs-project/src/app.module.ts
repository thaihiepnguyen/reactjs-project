import {DynamicModule, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "./typeorm";
import {AuthMiddleware} from "./modules/auth/auth.middleware";
@Module({})
export class AppModule implements NestModule {
  static forRoot(modules): DynamicModule {
    return {
      module: AppModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'bndfldpprlg9bq5dbymj-mysql.services.clever-cloud.com',
          port: 3306,
          username: 'untyigrruhzut6nf', // your username
          password: 'EzHurQYOCo1zhSnSrd5b', // your password
          database: 'bndfldpprlg9bq5dbymj', // name of database
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
        '/auth/login-social')
  }
}
