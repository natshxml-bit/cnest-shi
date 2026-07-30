import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set CORS super longgar biar aman buat semua client (localhost, browser, dll)
  app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
});

  await app.listen(process.env.PORT ?? 3000);
  console.log(`cnest jalan di http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
