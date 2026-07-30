import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';

// Mapping "order" dari frontend ke sort/sort_order upstream.
const ORDER_MAP: Record<string, { sort: string; sort_order: string }> = {
  popular: { sort: 'popularity', sort_order: 'desc' },
  latest: { sort: 'latest', sort_order: 'desc' },
  title: { sort: 'title', sort_order: 'asc' },
};

@Injectable()
export class FilterService {
  async getFilteredManga(filters: any) {
    try {
      const params = new URLSearchParams();

      // PENTING: "type" di frontend = format komik (manhwa/manga/manhua).
      // Upstream shngm.io pakai query "format" buat ini.
      if (filters.type) params.append('format', filters.type);

      params.append('genre_include_mode', 'or');
      params.append('genre_exclude_mode', 'or');

      if (filters.status) params.append('status', filters.status);

      const genreList = Array.isArray(filters.genre)
        ? filters.genre
        : filters.genre
          ? [filters.genre]
          : [];

      if (genreList.length) params.append('genre_include', genreList.join(','));

      const order = ORDER_MAP[filters.order] ?? ORDER_MAP.popular;
      params.append('sort', order.sort);
      params.append('sort_order', order.sort_order);
      params.append('page', String(filters.page || 1));
      params.append('page_size', '24');

      const upstream: any = await shngmFetch(`/manga/list?${params.toString()}`);

      // --- Normalisasi Response ---
      const rawResults = upstream?.data ?? [];

      const results = rawResults.map((item: any) => {
        const itemType = (item.type || item.format || filters.type || 'manhwa').toLowerCase();
        const coverUrl = item.cover_image_url || item.cover_portrait_url || item.thumb || item.thumbnail || '';

        return {
          ...item,
          type: itemType,
          thumb: coverUrl,
          thumbnail: coverUrl,
        };
      });

      const meta = upstream?.meta ?? {};
      const currentPage = Number(filters.page || 1);
      const totalPage = meta.total_page ?? meta.totalPage ?? currentPage;

      return {
        status: true,
        data: {
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
        error.message || 'Gagal fetch data filter',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ BARU: Fetch manga per genre slug
  async getByGenre(genreSlug: string, page = '1') {
    try {
      const params = new URLSearchParams();
      params.append('genre_include', genreSlug);
      params.append('genre_include_mode', 'or');
      params.append('genre_exclude_mode', 'or');
      params.append('sort', 'latest');
      params.append('sort_order', 'desc');
      params.append('page', String(page || 1));
      params.append('page_size', '24');

      const upstream: any = await shngmFetch(`/manga/list?${params.toString()}`);

      // Normalisasi response — sama persis kayak getFilteredManga
      const rawResults = upstream?.data ?? [];
      const results = rawResults.map((item: any) => {
        const itemType = (item.type || item.format || 'manhwa').toLowerCase();
        const coverUrl = item.cover_image_url || item.cover_portrait_url || item.thumb || item.thumbnail || '';
        return {
          ...item,
          type: itemType,
          thumb: coverUrl,
          thumbnail: coverUrl,
        };
      });

      const meta = upstream?.meta ?? {};
      const currentPage = Number(page || 1);
      const totalPage = meta.total_page ?? meta.totalPage ?? currentPage;

      return {
        status: true,
        data: {
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
        error.message || 'Gagal fetch manga per genre',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGenres() {
    try {
      const upstream: any = await shngmFetch(`/genre/list`);
      const rawGenres =
        upstream?.data?.genre ??
        upstream?.data?.genres ??
        upstream?.data ??
        []; // ✅ FIX: typo ??A → ??

      return (Array.isArray(rawGenres) ? rawGenres : []).map((g: any) => ({
        id: g.id ?? g.genre_id ?? g.slug ?? g.value,
        name: g.name ?? g.title ?? g.label,
      }));
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Gagal fetch data genre',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}