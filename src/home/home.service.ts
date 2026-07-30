import { Injectable } from '@nestjs/common';
import { shngmFetch } from '../common/shngm-client';

// Cache sederhana in-memory, TTL 5 menit.
// Kalau nanti mau scale multi-instance, ganti ini ke Redis.
let cache: { data: any; expiresAt: number } = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class HomeService {
  async getHome(forceFresh = false) {
    const now = Date.now();
    if (!forceFresh && cache.data && now < cache.expiresAt) {
      return cache.data;
    }

    // Semua request jalan PARALEL, bukan satu-satu.
    const [
      projectUpdate,
      mirrorUpdate,
      recommendedManhwa,
      recommendedManga,
      recommendedManhua,
      topDaily,
      topWeekly,
      topAllTime,
      announcementList,
    ] = await Promise.all([
      shngmFetch('/manga/list?type=project&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),
      shngmFetch('/manga/list?type=mirror&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),
      shngmFetch('/manga/list?format=manhwa&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
      shngmFetch('/manga/list?format=manga&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
      shngmFetch('/manga/list?format=manhua&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
      shngmFetch('/manga/top?filter=daily&page=1&page_size=10'),
      shngmFetch('/manga/top?filter=weekly&page=1&page_size=10'),
      shngmFetch('/manga/top?filter=all_time&page=1&page_size=10'),
      shngmFetch('/announcement/list?page=1&page_size=10'),
    ]);

    // Detail pengumuman butuh id dari list, jadi harus nunggu.
    // Nama field "announcement_id" ini cek lagi di tab Response devtools kamu.
    let announcementDetail = null;
    const firstId = announcementList?.data?.[0]?.announcement_id;
    if (firstId) {
      announcementDetail = await shngmFetch(`/announcement/detail/${firstId}`);
    }

    const payload = {
      status: true,
      data: {
        project_update: projectUpdate,
        mirror_update: mirrorUpdate,
        recommended: {
          manhwa: recommendedManhwa,
          manga: recommendedManga,
          manhua: recommendedManhua,
        },
        top: {
          daily: topDaily,
          weekly: topWeekly,
          all_time: topAllTime,
        },
        announcement: {
          list: announcementList,
          detail: announcementDetail,
        },
      },
      cached_at: new Date().toISOString(),
    };

    cache = { data: payload, expiresAt: now + CACHE_TTL_MS };
    return payload;
  }
}
