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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisCache = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AnalysisCache = class AnalysisCache {
};
exports.AnalysisCache = AnalysisCache;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AnalysisCache.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '캐시 키' }),
    (0, typeorm_1.Column)({ name: 'cache_key', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AnalysisCache.prototype, "cacheKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '캐시 데이터 (JSON)' }),
    (0, typeorm_1.Column)({ name: 'cache_data', type: 'json' }),
    __metadata("design:type", Object)
], AnalysisCache.prototype, "cacheData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '만료일시' }),
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], AnalysisCache.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일시' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AnalysisCache.prototype, "createdAt", void 0);
exports.AnalysisCache = AnalysisCache = __decorate([
    (0, typeorm_1.Entity)('analysis_cache'),
    (0, typeorm_1.Unique)(['cacheKey']),
    (0, typeorm_1.Index)(['expiresAt'])
], AnalysisCache);
//# sourceMappingURL=analysis-cache.entity.js.map