"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailService = void 0;
const common_1 = require("@nestjs/common");
const shngm_client_1 = require("../common/shngm-client");
async function fetchAllChapters(mangaId) {
    const pageSize = 100;
    const first = await (0, shngm_client_1.shngmFetch)(`/chapter/${mangaId}/list?page=1&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`);
    const chapters = [...(first?.data ?? [])];
    const totalPage = first?.meta?.total_page ??
        first?.meta?.totalPage ??
        first?.pagination?.total_page ??
        first?.total_page ??
        1;
    if (totalPage > 1) {
        const remainingPages = Array.from({ length: totalPage - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(remainingPages.map((page) => (0, shngm_client_1.shngmFetch)(`/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`)));
        for (const r of rest) {
            chapters.push(...(r?.data ?? []));
        }
    }
    return chapters;
}
let DetailService = class DetailService {
    async getDetail(mangaId) {
        try {
            const [detail, chapters] = await Promise.all([
                (0, shngm_client_1.shngmFetch)(`/manga/detail/${mangaId}`),
                fetchAllChapters(mangaId),
            ]);
            return {
                status: true,
                data: {
                    ...(detail?.data ?? detail),
                    chapters,
                },
            };
        }
        catch (err) {
            throw new common_1.NotFoundException(`Gagal ambil detail manga "${mangaId}": ${err.message}`);
        }
    }
};
exports.DetailService = DetailService;
exports.DetailService = DetailService = __decorate([
    (0, common_1.Injectable)()
], DetailService);
//# sourceMappingURL=detail.service.js.map