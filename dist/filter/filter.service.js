"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterService = void 0;
const common_1 = require("@nestjs/common");
const shngm_client_1 = require("../common/shngm-client");
const ORDER_MAP = {
    popular: { sort: 'popularity', sort_order: 'desc' },
    latest: { sort: 'latest', sort_order: 'desc' },
    title: { sort: 'title', sort_order: 'asc' },
};
let FilterService = class FilterService {
    async getFilteredManga(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.type)
                params.append('format', filters.type);
            params.append('genre_include_mode', 'or');
            params.append('genre_exclude_mode', 'or');
            if (filters.status)
                params.append('status', filters.status);
            const genreList = Array.isArray(filters.genre)
                ? filters.genre
                : filters.genre
                    ? [filters.genre]
                    : [];
            if (genreList.length)
                params.append('genre_include', genreList.join(','));
            const order = ORDER_MAP[filters.order] ?? ORDER_MAP.popular;
            params.append('sort', order.sort);
            params.append('sort_order', order.sort_order);
            params.append('page', String(filters.page || 1));
            params.append('page_size', '24');
            const upstream = await (0, shngm_client_1.shngmFetch)(`/manga/list?${params.toString()}`);
            const rawResults = upstream?.data ?? [];
            const results = rawResults.map((item) => {
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal fetch data filter', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByGenre(genreSlug, page = '1') {
        try {
            const params = new URLSearchParams();
            params.append('genre_include', genreSlug);
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal fetch manga per genre', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGenres() {
        try {
            const upstream = await (0, shngm_client_1.shngmFetch)(`/genre/list`);
            const rawGenres = upstream?.data?.genre ??
                upstream?.data?.genres ??
                upstream?.data ??
                [];
            return (Array.isArray(rawGenres) ? rawGenres : []).map((g) => ({
                id: g.id ?? g.genre_id ?? g.slug ?? g.value,
                name: g.name ?? g.title ?? g.label,
            }));
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal fetch data genre', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FilterService = FilterService;
exports.FilterService = FilterService = __decorate([
    (0, common_1.Injectable)()
], FilterService);
//# sourceMappingURL=filter.service.js.map