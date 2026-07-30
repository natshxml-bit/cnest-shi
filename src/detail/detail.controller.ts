import { Controller, Get, Param } from '@nestjs/common';
import { DetailService } from './detail.service';

@Controller('detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  // GET /api/detail/:mangaId -> detail komik + chapter list dalam 1 response
  @Get(':mangaId')
  async getDetail(@Param('mangaId') mangaId: string) {
    return this.detailService.getDetail(mangaId);
  }
}
