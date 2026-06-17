import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // تمنع وتتجاهل أي حقل زائد يرسله العميل ليس موجوداً في الـ DTO
      transform: true, // تقوم بتحويل البيانات تلقائياً إلى أنواعها المحددة في الـ DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
