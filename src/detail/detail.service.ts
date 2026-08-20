import { Injectable, NotFoundException } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';

/**
 * Ambil SEMUA chapter, bukan cuma page 1.
 * Page pertama dipakai buat baca total halaman, sisanya di-fetch paralel.
 *
 * ⚠️ Field nama total halaman (`total_page` dkk) ini TEBAKAN — kalau
 * hasilnya masih kepotong, buka tab "Response" di devtools pas request
 * /chapter/{id}/list, cari field yang nunjukin total halaman/total data,
 * terus ganti nama field di bawah ini biar sesuai.
 */
export async function fetchAllChapters(mangaId: string) {
  const pageSize = 100;
  const first = await shngmFetch(
    `/chapter/${mangaId}/list?page=1&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`,
  );

  const chapters = [...(first?.data ?? [])];

  const totalPage: number =
    first?.meta?.total_page ??
    first?.meta?.totalPage ??
    first?.pagination?.total_page ??
    first?.total_page ??
    1;

  if (totalPage > 1) {
    const remainingPages = Array.from({ length: totalPage - 1 }, (_, i) => i + 2);
    const rest = await Promise.all(
      remainingPages.map((page) =>
        shngmFetch(
          `/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`,
        ),
      ),
    );
    for (const r of rest) {
      chapters.push(...(r?.data ?? []));
    }
  }

  return chapters;
}

@Injectable()
export class DetailService {
  /**
   * Gabungin detail manga + daftar chapter jadi 1 response,
   * biar client cukup hit 1x endpoint aja waktu buka halaman detail komik.
   *
   * ✅ Path sudah diverifikasi dari devtools capture halaman detail komik:
   *   - GET /v1/manga/detail/{mangaId}
   *   - GET /v1/chapter/{mangaId}/list?page=1&page_size=24&sort_by=chapter_number&sort_order=desc
   */
  async getDetail(mangaId: string) {
    try {
      const [detail, chapters] = await Promise.all([
        shngmFetch(`/manga/detail/${mangaId}`),
        fetchAllChapters(mangaId),
      ]);

      return {
        status: true,
        data: {
          ...(detail?.data ?? detail),
          chapters,
        },
      };
    } catch (err) {
      throw new NotFoundException(
        `Gagal ambil detail manga "${mangaId}": ${(err as Error).message}`,
      );
    }
  }
}
