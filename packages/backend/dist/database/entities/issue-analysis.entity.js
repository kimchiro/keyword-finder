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
exports.IssueAnalysis = exports.TrendDirection = exports.IssueType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const keyword_entity_1 = require("./keyword.entity");
var IssueType;
(function (IssueType) {
    IssueType["RISING"] = "\uAE09\uC0C1\uC2B9";
    IssueType["STABLE"] = "\uC548\uC815";
    IssueType["FALLING"] = "\uD558\uB77D";
    IssueType["NEW"] = "\uC2E0\uADDC";
})(IssueType || (exports.IssueType = IssueType = {}));
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["UP"] = "\uC0C1\uC2B9";
    TrendDirection["DOWN"] = "\uD558\uB77D";
    TrendDirection["MAINTAIN"] = "\uC720\uC9C0";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
let IssueAnalysis = class IssueAnalysis {
};
exports.IssueAnalysis = IssueAnalysis;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '고유 ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], IssueAnalysis.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드 ID' }),
    (0, typeorm_1.Column)({ name: 'keyword_id', type: 'int' }),
    __metadata("design:type", Number)
], IssueAnalysis.prototype, "keywordId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], IssueAnalysis.prototype, "keyword", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => keyword_entity_1.Keyword, (keyword) => keyword.issueAnalysis, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'keyword_id' }),
    __metadata("design:type", keyword_entity_1.Keyword)
], IssueAnalysis.prototype, "keywordEntity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '이슈 타입', enum: IssueType }),
    (0, typeorm_1.Column)({
        name: 'issue_type',
        type: 'enum',
        enum: IssueType,
    }),
    __metadata("design:type", String)
], IssueAnalysis.prototype, "issueType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '이슈 점수' }),
    (0, typeorm_1.Column)({ name: 'issue_score', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IssueAnalysis.prototype, "issueScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '트렌드 방향', enum: TrendDirection }),
    (0, typeorm_1.Column)({
        name: 'trend_direction',
        type: 'enum',
        enum: TrendDirection,
        default: TrendDirection.MAINTAIN,
    }),
    __metadata("design:type", String)
], IssueAnalysis.prototype, "trendDirection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '변동성 점수' }),
    (0, typeorm_1.Column)({ name: 'volatility_score', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], IssueAnalysis.prototype, "volatilityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '분석 날짜' }),
    (0, typeorm_1.Column)({ name: 'analysis_date', type: 'date' }),
    __metadata("design:type", Date)
], IssueAnalysis.prototype, "analysisDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일시' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IssueAnalysis.prototype, "createdAt", void 0);
exports.IssueAnalysis = IssueAnalysis = __decorate([
    (0, typeorm_1.Entity)('issue_analysis'),
    (0, typeorm_1.Unique)(['keywordId', 'analysisDate']),
    (0, typeorm_1.Index)(['keywordId']),
    (0, typeorm_1.Index)(['issueType']),
    (0, typeorm_1.Index)(['analysisDate'])
], IssueAnalysis);
//# sourceMappingURL=issue-analysis.entity.js.map