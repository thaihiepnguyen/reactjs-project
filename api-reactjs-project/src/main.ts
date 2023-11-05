import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'
const PORT = 3001;

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
  const app = await NestFactory.create(
    AppModule.forRoot(await dynamicImport('module'))
  );
  await app.listen(PORT || 3001);
  console.log('App is running on port: ', PORT || 3001);
}
bootstrap();
