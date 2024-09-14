import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function swagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Style N Glitter')
    .setDescription('Style N Glitter apis')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
