import helmet from 'helmet';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import swagger from './swagger.loader';
import { ResponseInterceptor } from '@lib/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/lib/filters/exception.filter';
import { Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

export default function loader(app: INestApplication<any>) {
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  app.enableCors({
    origin: [
      'https://www.stylenglitter.com',
      'http://localhost:3000',
      'https://www.admin.stylenglitter.com',
      'https://main.d7bw6xdmmxtj1.amplifyapp.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Helmet
  app.use(helmet());

  // Validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // Filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  swagger(app);
}
