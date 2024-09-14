import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate as validateEnvs } from '@config/envs/env.validation';
import configuration from '@config/envs/configuration';
import { Environment } from './config/envs/types';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvs,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.dbName'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.dbSync'),
        logging:
          configService.get<Environment>('nodeEnv') !== Environment.Production,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 3,
      },
      {
        name: 'medium',
        ttl: seconds(10),
        limit: 20,
      },
      {
        name: 'long',
        ttl: seconds(60),
        limit: 100,
      },
    ]),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
