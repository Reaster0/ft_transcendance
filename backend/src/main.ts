import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

async function startServerCI(app: INestApplication) {
  const promise = app.listen(3000);
  if (process.argv.slice(2).indexOf("CI") !== -1) {
    await new Promise(r => setTimeout(r, 10 *1000));
    return app.close();
  }
  return promise;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('42 project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await startServerCI(app);
}

bootstrap();
