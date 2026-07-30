"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterService = void 0;
const common_1 = require("@nestjs/common");
const shngm_client_1 = require("../common/shngm-client");
let ChapterService = class ChapterService {
    async getChapterDetail(chapterId) {
        try {
            const endpoint = `/chapter/detail/${chapterId}`;
            const response = await (0, shngm_client_1.shngmFetch)(endpoint);
            const chapterData = response.data;
            const baseUrl = chapterData.base_url;
            const imagePath = chapterData.chapter.path;
            const imageFiles = chapterData.chapter.data;
            const images = imageFiles.map((filename) => {
                return `${baseUrl}${imagePath}${filename}`;
            });
            response.data.images = images;
            delete response.data.chapter;
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Gagal fetch data chapter', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChapterService = ChapterService;
exports.ChapterService = ChapterService = __decorate([
    (0, common_1.Injectable)()
], ChapterService);
//# sourceMappingURL=chapter.service.js.map