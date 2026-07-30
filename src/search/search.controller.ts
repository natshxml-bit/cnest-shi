import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // GET /search?q=keyword&page=1
  @Get('search')
  async search(@Query('q') q: string, @Query('page') page?: string) {
    return this.searchService.search(q, page);
  }
}
