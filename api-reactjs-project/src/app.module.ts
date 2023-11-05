import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "./typeorm";
@Module({})
export class AppModule {
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
}
