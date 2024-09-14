import helmet from 'helmet';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import swagger from './swagger.loader';

export default function loader(app: INestApplication<any>) {
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  app.enableCors();

  // Helmet
  app.use(helmet());

  // Validator
  app.useGlobalPipes(new ValidationPipe());

  swagger(app);
}
