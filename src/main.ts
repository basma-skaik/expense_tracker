import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // تمنع وتتجاهل أي حقل زائد يرسله العميل ليس موجوداً في الـ DTO
      transform: true, // تقوم بتحويل البيانات تلقائياً إلى أنواعها المحددة في الـ DTO
    }),
  );

  // 2. Unify all application errors structure
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Unify all application success responses structure
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
