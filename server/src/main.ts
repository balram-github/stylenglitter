import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import loader from '@/loaders/app.loader';

async function bootstrap() {
  const logger = new Logger('Main.ts');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('port');

  loader(app);

  await app.listen(port);

  logger.log(`Application running on port ${port}`);
}
bootstrap();
