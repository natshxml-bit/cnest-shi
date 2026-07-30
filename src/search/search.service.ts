import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';

@Injectable()
export class SearchService {
  async search(q: string, page = '1') {
    if (!q || !q.trim()) {
      throw new BadRequestException('Query pencarian (q) wajib diisi');
    }

    try {
      const params = new URLSearchParams();
      params.append('q', q.trim());
      params.append('genre_include_mode', 'or');
      params.append('genre_exclude_mode', 'or');
      params.append('sort', 'latest');
      params.append('sort_order', 'desc');
      params.append('page', String(page || 1));
      params.append('page_size', '24');

      const upstream: any = await shngmFetch(`/manga/list?${params.toString()}`);

      // --- NORMALISASI (sama kayak filter.service.ts) ---
      const rawResults = upstream?.data ?? [];
      const results = rawResults.map((item: any) => {
        const itemType = (item.type || item.format || 'manhwa').toLowerCase();
        const coverUrl =
          item.cover_image_url ||
          item.cover_portrait_url ||
          item.thumb ||
          item.thumbnail ||
          '';

        return {
          ...item,
          type: itemType,
          thumb: coverUrl,
          thumbnail: coverUrl,
        };
      });
      // ---------------------------------------------------

      const meta = upstream?.meta ?? {};
      const currentPage = Number(page || 1);
      const totalPage = meta.total_page ?? meta.totalPage ?? currentPage;

      return {
        status: true,
        data: {
          query: q.trim(),
          results,
          pagination: {
            page: currentPage,
            total_page: totalPage,
            has_next: currentPage < totalPage,
          },
        },
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Gagal fetch hasil pencarian',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}