import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './modules/auth/auth.guard';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { config } from 'dotenv';
import * as process from 'process';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { getEntities } from './typeorm';
config();

function getFiles(type: string, prefix: string) {
  const result = [];
  function innerRecursion(type: string, prefix: string) {
    const __dirname = fs.realpathSync('.');
    const files = fs.readdirSync(__dirname + '/src/' + prefix);

    for (const file of files) {
      if (file.endsWith(`.${type}.ts`)) {
        result.push(prefix + '/' + file);
      } else if (!file.includes('.')) {
        innerRecursion(type, prefix + '/' + file);
      }
    }
  }
  innerRecursion(type, prefix);
  return result;
}

async function dynamicImport(prefix: string) {
  const moduleFiles = getFiles('module', prefix);
  const modules = await Promise.all(
    moduleFiles.map((file) => {
      return import('./' + file.replace('.ts', '')) as never;
    }),
  );
  return modules.map((x) => x[Object.keys(x)[0]] || (x as any).default);
}

async function bootstrap() {
  const modules = await dynamicImport('modules');
  const entities = await getEntities();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot({
      modules,
      entities,
    }),
  );

  const corsOptions: CorsOptions = {
    origin: [process.env.CLIENT_URL, 'http://127.0.0.1:3000'], // Replace with the actual origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalGuards(new AuthGuard());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3001);
  console.log('App is running on port: ', process.env.PORT || 3001);
}
bootstrap();
