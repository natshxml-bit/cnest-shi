import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';
import { ChapterModule } from './chapter/chapter.module';
import { FilterModule } from './filter/filter.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [HomeModule, DetailModule, ChapterModule, FilterModule, SearchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
