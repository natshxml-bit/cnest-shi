import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';

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

      return response;
    } catch (error) {
      throw new HttpException(
        error.message || 'Gagal fetch data chapter',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
