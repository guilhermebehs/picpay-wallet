import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { HttpExceptionFilter } from './infra/filters/http-exception.filter';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  config();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cash Flow')
    .setDescription('Cash flow API description')
    .setVersion('1.0')
    .addTag('cash-flow')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => console.log(`Listening on ${port}`));
}
bootstrap();
