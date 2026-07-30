"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterController = void 0;
const common_1 = require("@nestjs/common");
const filter_service_1 = require("./filter.service");
let FilterController = class FilterController {
    constructor(filterService) {
        this.filterService = filterService;
    }
    async getFilteredManga(query) {
        return this.filterService.getFilteredManga(query);
    }
    async getGenres() {
        return this.filterService.getGenres();
    }
    async getByGenre(slug, page) {
        return this.filterService.getByGenre(slug, page);
    }
};
exports.FilterController = FilterController;
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilterController.prototype, "getFilteredManga", null);
__decorate([
    (0, common_1.Get)('genres'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilterController.prototype, "getGenres", null);
__decorate([
    (0, common_1.Get)('genre/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FilterController.prototype, "getByGenre", null);
exports.FilterController = FilterController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [filter_service_1.FilterService])
], FilterController);
//# sourceMappingURL=filter.controller.js.map