import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // GET /api/home           -> pakai cache kalau masih fresh
  // GET /api/home?fresh=true -> paksa fetch ulang, skip cache
  @Get()
  async getHome(@Query('fresh') fresh?: string) {
    return this.homeService.getHome(fresh === 'true');
  }
}
