"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const shngm_client_1 = require("../common/shngm-client");
let cache = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000;
let HomeService = class HomeService {
    async getHome(forceFresh = false) {
        const now = Date.now();
        if (!forceFresh && cache.data && now < cache.expiresAt) {
            return cache.data;
        }
        const [projectUpdate, mirrorUpdate, recommendedManhwa, recommendedManga, recommendedManhua, topDaily, topWeekly, topAllTime, announcementList,] = await Promise.all([
            (0, shngm_client_1.shngmFetch)('/manga/list?type=project&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),
            (0, shngm_client_1.shngmFetch)('/manga/list?type=mirror&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),
            (0, shngm_client_1.shngmFetch)('/manga/list?format=manhwa&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
            (0, shngm_client_1.shngmFetch)('/manga/list?format=manga&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
            (0, shngm_client_1.shngmFetch)('/manga/list?format=manhua&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc'),
            (0, shngm_client_1.shngmFetch)('/manga/top?filter=daily&page=1&page_size=10'),
            (0, shngm_client_1.shngmFetch)('/manga/top?filter=weekly&page=1&page_size=10'),
            (0, shngm_client_1.shngmFetch)('/manga/top?filter=all_time&page=1&page_size=10'),
            (0, shngm_client_1.shngmFetch)('/announcement/list?page=1&page_size=10'),
        ]);
        let announcementDetail = null;
        const firstId = announcementList?.data?.[0]?.announcement_id;
        if (firstId) {
            announcementDetail = await (0, shngm_client_1.shngmFetch)(`/announcement/detail/${firstId}`);
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
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)()
], HomeService);
//# sourceMappingURL=home.service.js.map