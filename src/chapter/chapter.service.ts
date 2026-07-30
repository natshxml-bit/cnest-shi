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

      // 1. Masukin array 'images' yang udah jadi full URL
      response.data.images = images;

      // 2. HAPUS object 'chapter' bawaan upstream biar JSON-nya bersih
      delete response.data.chapter; 

      // (Opsional) Kalau lu mau hapus base_url dan base_url_low juga, uncomment ini:
      // delete response.data.base_url;
      // delete response.data.base_url_low;

      return response;
    } catch (error) {
      throw new HttpException(
        error.message || 'Gagal fetch data chapter',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
