import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
  });
  app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();
