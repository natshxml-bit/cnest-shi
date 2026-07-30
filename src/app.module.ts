import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';
import { ChapterModule } from './chapter/chapter.module';
import { FilterModule } from './filter/filter.module';
import { SearchModule } from './search/search.module';
import { ApiKeyGuard } from './common/api-key.guard';

@Module({
  imports: [
    // Load environment variable dari file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limit default: max 40 request / 10 detik per IP
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 40,
      },
    ]),

    HomeModule,
    DetailModule,
    ChapterModule,
    FilterModule,
    SearchModule,
  ],

  controllers: [],

  providers: [
    // ApiKeyGuard jalan dulu:
    // cek header x-api-key
    // baru ThrottlerGuard untuk rate limit
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}