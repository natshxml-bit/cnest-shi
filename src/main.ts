import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ALLOWED_ORIGINS = comma-separated list, contoh:
  // "https://tsukinest.vercel.app,https://tsukinest.com"
  // Kosongin cuma buat dev lokal, WAJIB di-set di Railway.
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true, // true = reflect (dev only)
    methods: 'GET,HEAD,OPTIONS',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`cnest jalan di http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
