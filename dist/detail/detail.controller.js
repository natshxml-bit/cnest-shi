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
exports.DetailController = void 0;
const common_1 = require("@nestjs/common");
const detail_service_1 = require("./detail.service");
let DetailController = class DetailController {
    constructor(detailService) {
        this.detailService = detailService;
    }
    async getDetail(mangaId) {
        return this.detailService.getDetail(mangaId);
    }
};
exports.DetailController = DetailController;
__decorate([
    (0, common_1.Get)(':mangaId'),
    __param(0, (0, common_1.Param)('mangaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DetailController.prototype, "getDetail", null);
exports.DetailController = DetailController = __decorate([
    (0, common_1.Controller)('detail'),
    __metadata("design:paramtypes", [detail_service_1.DetailService])
], DetailController);
//# sourceMappingURL=detail.controller.js.map