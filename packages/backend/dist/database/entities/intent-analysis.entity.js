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
exports.IntentAnalysis = exports.PrimaryIntent = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const keyword_entity_1 = require("./keyword.entity");
var PrimaryIntent;
(function (PrimaryIntent) {
    PrimaryIntent["INFORMATIONAL"] = "\uC815\uBCF4\uC131";
    PrimaryIntent["COMMERCIAL"] = "\uC0C1\uC5C5\uC131";
    PrimaryIntent["MIXED"] = "\uD63C\uD569";
})(PrimaryIntent || (exports.PrimaryIntent = PrimaryIntent = {}));
let IntentAnalysis = class IntentAnalysis {
};
exports.IntentAnalysis = IntentAnalysis;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IntentAnalysis.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드 ID' }),
    (0, typeorm_1.Column)({ name: 'keyword_id', type: 'int' }),
    __metadata("design:type", Number)
], IntentAnalysis.prototype, "keywordId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], IntentAnalysis.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => keyword_entity_1.Keyword, (keyword) => keyword.intentAnalysis, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'keyword_id' }),
    __metadata("design:type", keyword_entity_1.Keyword)
], IntentAnalysis.prototype, "keywordEntity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '정보성 비율' }),
    (0, typeorm_1.Column)({ name: 'informational_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IntentAnalysis.prototype, "informationalRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '상업성 비율' }),
    (0, typeorm_1.Column)({ name: 'commercial_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IntentAnalysis.prototype, "commercialRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '주요 의도', enum: PrimaryIntent }),
    (0, typeorm_1.Column)({
        name: 'primary_intent',
        type: 'enum',
        enum: PrimaryIntent,
        default: PrimaryIntent.MIXED,
    }),
    __metadata("design:type", String)
], IntentAnalysis.prototype, "primaryIntent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '신뢰도 점수' }),
    (0, typeorm_1.Column)({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IntentAnalysis.prototype, "confidenceScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '분석 날짜' }),
    (0, typeorm_1.Column)({ name: 'analysis_date', type: 'date' }),
    __metadata("design:type", Date)
], IntentAnalysis.prototype, "analysisDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일시' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IntentAnalysis.prototype, "createdAt", void 0);
exports.IntentAnalysis = IntentAnalysis = __decorate([
    (0, typeorm_1.Entity)('intent_analysis'),
    (0, typeorm_1.Unique)(['keywordId', 'analysisDate']),
    (0, typeorm_1.Index)(['keywordId']),
    (0, typeorm_1.Index)(['primaryIntent']),
    (0, typeorm_1.Index)(['analysisDate'])
], IntentAnalysis);
//# sourceMappingURL=intent-analysis.entity.js.map