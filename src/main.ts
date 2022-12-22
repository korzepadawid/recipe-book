import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Configures Swagger and returns the config.
 * @returns The Swagger config.
 */
const configSwagger = (): Omit<OpenAPIObject, 'paths'> =>
  new DocumentBuilder()
    .setTitle('My social media platform')
    .setDescription('The endpoints documentation with the OpenAPI')
    .setVersion('1.0')
    .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixes
  app.setGlobalPrefix('/api/v1');

  // Swagger
  const document = SwaggerModule.createDocument(app, configSwagger());
  SwaggerModule.setup('docs', app, document);

  // Validation pipelines
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
