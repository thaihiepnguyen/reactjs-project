import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('App is running on port: ', PORT || 3001);
  await app.listen(PORT || 3001);
}
bootstrap();
