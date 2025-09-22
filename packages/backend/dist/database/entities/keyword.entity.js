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
exports.Keyword = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const keyword_analytics_entity_1 = require("./keyword-analytics.entity");
const related_keywords_entity_1 = require("./related-keywords.entity");
const gender_search_ratios_entity_1 = require("./gender-search-ratios.entity");
const weekday_search_ratios_entity_1 = require("./weekday-search-ratios.entity");
const intent_analysis_entity_1 = require("./intent-analysis.entity");
const issue_analysis_entity_1 = require("./issue-analysis.entity");
const keyword_collection_logs_entity_1 = require("./keyword-collection-logs.entity");
let Keyword = class Keyword {
};
exports.Keyword = Keyword;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Keyword.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Keyword.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드 상태' }),
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Keyword.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일시' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Keyword.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수정일시' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Keyword.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => keyword_analytics_entity_1.KeywordAnalytics, (analytics) => analytics.keyword),
    __metadata("design:type", Array)
], Keyword.prototype, "analytics", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => related_keywords_entity_1.RelatedKeywords, (related) => related.baseKeywordEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "relatedKeywords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gender_search_ratios_entity_1.GenderSearchRatios, (ratios) => ratios.keywordEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "genderSearchRatios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => weekday_search_ratios_entity_1.WeekdaySearchRatios, (ratios) => ratios.keywordEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "weekdaySearchRatios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => intent_analysis_entity_1.IntentAnalysis, (analysis) => analysis.keywordEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "intentAnalysis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => issue_analysis_entity_1.IssueAnalysis, (analysis) => analysis.keywordEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "issueAnalysis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => keyword_collection_logs_entity_1.KeywordCollectionLogs, (logs) => logs.baseQueryEntity),
    __metadata("design:type", Array)
], Keyword.prototype, "collectionLogs", void 0);
exports.Keyword = Keyword = __decorate([
    (0, typeorm_1.Entity)('keywords'),
    (0, typeorm_1.Index)(['keyword'], { unique: true })
], Keyword);
//# sourceMappingURL=keyword.entity.js.map