import { Controller, Get, Query, Param } from '@nestjs/common'; // ✅ Tambah Param
import { FilterService } from './filter.service';

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  // GET /filter?genre[]=x&type=manhwa&status=ongoing&order=latest&page=1
  @Get('filter')
  async getFilteredManga(@Query() query: any) {
    return this.filterService.getFilteredManga(query);
  }

  // GET /genres
  @Get('genres')
  async getGenres() {
    return this.filterService.getGenres();
  }

  // ✅ BARU: GET /genre/:slug?page=1
  @Get('genre/:slug')
  async getByGenre(@Param('slug') slug: string, @Query('page') page?: string) {
    return this.filterService.getByGenre(slug, page);
  }
}