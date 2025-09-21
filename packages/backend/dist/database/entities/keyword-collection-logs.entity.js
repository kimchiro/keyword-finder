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
exports.KeywordCollectionLogs = exports.CollectionType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var CollectionType;
(function (CollectionType) {
    CollectionType["TRENDING"] = "trending";
    CollectionType["SMARTBLOCK"] = "smartblock";
})(CollectionType || (exports.CollectionType = CollectionType = {}));
let KeywordCollectionLogs = class KeywordCollectionLogs {
};
exports.KeywordCollectionLogs = KeywordCollectionLogs;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KeywordCollectionLogs.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '기준 검색어' }),
    (0, typeorm_1.Column)({ name: 'base_query', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], KeywordCollectionLogs.prototype, "baseQuery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수집된 키워드' }),
    (0, typeorm_1.Column)({ name: 'collected_keyword', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], KeywordCollectionLogs.prototype, "collectedKeyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수집 타입', enum: CollectionType }),
    (0, typeorm_1.Column)({
        name: 'collection_type',
        type: 'enum',
        enum: CollectionType,
    }),
    __metadata("design:type", String)
], KeywordCollectionLogs.prototype, "collectionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '소스 페이지' }),
    (0, typeorm_1.Column)({ name: 'source_page', type: 'varchar', length: 100, default: 'naver' }),
    __metadata("design:type", String)
], KeywordCollectionLogs.prototype, "sourcePage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '순위' }),
    (0, typeorm_1.Column)({ name: 'rank_position', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], KeywordCollectionLogs.prototype, "rankPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수집일시' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'collected_at' }),
    __metadata("design:type", Date)
], KeywordCollectionLogs.prototype, "collectedAt", void 0);
exports.KeywordCollectionLogs = KeywordCollectionLogs = __decorate([
    (0, typeorm_1.Entity)('keyword_collection_logs'),
    (0, typeorm_1.Index)(['baseQuery']),
    (0, typeorm_1.Index)(['collectionType']),
    (0, typeorm_1.Index)(['collectedAt'])
], KeywordCollectionLogs);
//# sourceMappingURL=keyword-collection-logs.entity.js.map