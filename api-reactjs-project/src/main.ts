import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import {AuthGuard} from "./modules/auth/auth.guard";
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { config } from 'dotenv';
import * as process from "process";
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";
config();

async function dynamicImport(type): Promise<any> {
  const PREFIX = '/src/modules';
  const __dirname = fs.realpathSync('.');
  const modules = fs.readdirSync(__dirname + PREFIX);

  return (await Promise.all(modules.reduce((acc, cur) => {
    const files = fs.readdirSync(__dirname + PREFIX + '/' + cur);
    for (let file of files) {
      if (file.endsWith(`.${type}.ts`)) {
        acc.push(import(`./modules/${cur}/${cur}.${type}`) as never)
      }
    }
    return acc
  }, []))).map((x) => x[Object.keys(x)[0]] || (x as any).default)
}


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(await dynamicImport('module'))
  );

  const corsOptions: CorsOptions = {
    origin: [process.env.CLIENT_URL, 'http://127.0.0.1:3000'],  // Replace with the actual origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3001);
  console.log('App is running on port: ', process.env.PORT || 3001);
}
bootstrap();
