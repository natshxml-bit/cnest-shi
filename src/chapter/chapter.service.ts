import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';
import { fetchAllChapters } from '../detail/detail.service';

@Injectable()
export class ChapterService {
  async getChapterDetail(chapterId: string) {
    try {
      const endpoint = `/chapter/detail/${chapterId}`; 
      const response = await shngmFetch(endpoint);

      const chapterData = response.data;
      const baseUrl = chapterData.base_url;
      const imagePath = chapterData.chapter.path;
      const imageFiles = chapterData.chapter.data;

      const images = imageFiles.map((filename: string) => {
        return `${baseUrl}${imagePath}${filename}`;
      });

      // FIX: dulu di sini langsung `delete response.data.chapter` abis cuma
      // narik path+data buat gambar — padahal metadata penting (title,
      // chapter_number, prev/next chapter id, dll, apapun nama field aslinya
      // dari upstream) kemungkinan besar nyimpen di object 'chapter' ini juga.
      // Sekarang di-spread ke atas dulu biar gak ada yang kebuang percuma,
      // baru object 'chapter' bawaannya dihapus.
      const { path: _path, data: _data, ...chapterMeta } = chapterData.chapter;
      response.data = { ...response.data, ...chapterMeta, images };

      // FIX: daftar chapter buat drawer "Daftar Chapter" di reader frontend.
      // Upstream /chapter/detail GAK ngirim daftar chapter sama sekali, jadi
      // drawer reader selalu kosong ("Chapter tidak ditemukan"). Ambil dari
      // endpoint chapter list pake manga_id (sama kayak /detail), terus
      // gabungin. slug = chapter_id biar konsisten sama URL frontend
      // (useMangaDetail fallback ke chapter_id kalau gak ada slug).
      const mangaId = chapterData.manga_id || response.data.manga_id;
      if (mangaId) {
        try {
          const rawChapters = await fetchAllChapters(mangaId);
          response.data.chapters = rawChapters.map((c: any) => ({
            slug: c.chapter_id,
            number: String(c.chapter_number ?? '').replace(/^Chapter\s+/i, ''),
            url: '',
          }));
        } catch {
          // Daftar chapter cuma bonus — gagal nariknya jangan bikin
          // isi chapter (gambar) ikut rusak.
          response.data.chapters = [];
        }
      }

      return response;
    } catch (error) {
      throw new HttpException(
        error.message || 'Gagal fetch data chapter',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
