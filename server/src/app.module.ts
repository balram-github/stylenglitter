import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate as validateEnvs } from '@config/envs/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvs,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
