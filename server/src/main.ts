import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@config/envs/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables>);

  const port = configService.get('PORT');

  await app.listen(port, () => {
    console.log('Successfully started the server');
  });
}
bootstrap();
