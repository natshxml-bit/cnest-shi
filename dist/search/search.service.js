"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const shngm_client_1 = require("../common/shngm-client");
let SearchService = class SearchService {
    async search(q, page = '1') {
        if (!q || !q.trim()) {
            throw new common_1.BadRequestException('Query pencarian (q) wajib diisi');
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
            const upstream = await (0, shngm_client_1.shngmFetch)(`/manga/list?${params.toString()}`);
            const rawResults = upstream?.data ?? [];
            const results = rawResults.map((item) => {
                const itemType = (item.type || item.format || 'manhwa').toLowerCase();
                const coverUrl = item.cover_image_url ||
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal fetch hasil pencarian', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)()
], SearchService);
//# sourceMappingURL=search.service.js.map