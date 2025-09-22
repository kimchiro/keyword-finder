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
exports.BatchResponseDto = exports.MultipleKeywordsLimitedDataResponseDto = exports.SingleKeywordFullDataResponseDto = exports.BatchRequestDto = exports.MultipleKeywordsLimitedDataDto = exports.SingleKeywordFullDataDto = exports.IntegratedDataResponseDto = exports.DatalabTrendResponseDto = exports.BlogSearchResponseDto = exports.IntegratedDataDto = exports.DatalabTrendDto = exports.BlogSearchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_constants_1 = require("../../../constants/api.constants");
class BlogSearchDto {
}
exports.BlogSearchDto = BlogSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '검색어', example: '맛집' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BlogSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '검색 결과 개수 (1-100)',
        example: 10,
        minimum: 1,
        maximum: 100,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], BlogSearchDto.prototype, "display", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '검색 시작 위치 (1-1000)',
        example: 1,
        minimum: 1,
        maximum: 1000,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], BlogSearchDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '정렬 방식 (sim: 정확도순, date: 날짜순)',
        example: 'sim',
        enum: ['sim', 'date'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogSearchDto.prototype, "sort", void 0);
class DatalabTrendDto {
}
exports.DatalabTrendDto = DatalabTrendDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '검색어', example: '맛집' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DatalabTrendDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시작 날짜 (YYYY-MM-DD)',
        example: api_constants_1.SEARCH_TREND_API.DEFAULT_DATE_RANGE.START_DATE,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatalabTrendDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '종료 날짜 (YYYY-MM-DD)',
        example: api_constants_1.SEARCH_TREND_API.DEFAULT_DATE_RANGE.END_DATE,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatalabTrendDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시간 단위 (date: 일별, week: 주별, month: 월별)',
        example: 'month',
        enum: ['date', 'week', 'month'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatalabTrendDto.prototype, "timeUnit", void 0);
class IntegratedDataDto {
}
exports.IntegratedDataDto = IntegratedDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '검색어', example: '맛집' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IntegratedDataDto.prototype, "query", void 0);
class BlogSearchResponseDto {
}
exports.BlogSearchResponseDto = BlogSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], BlogSearchResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], BlogSearchResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '검색 결과' }),
    __metadata("design:type", Object)
], BlogSearchResponseDto.prototype, "data", void 0);
class DatalabTrendResponseDto {
}
exports.DatalabTrendResponseDto = DatalabTrendResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], DatalabTrendResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], DatalabTrendResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '트렌드 데이터' }),
    __metadata("design:type", Object)
], DatalabTrendResponseDto.prototype, "data", void 0);
class IntegratedDataResponseDto {
}
exports.IntegratedDataResponseDto = IntegratedDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], IntegratedDataResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], IntegratedDataResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '통합 데이터' }),
    __metadata("design:type", Object)
], IntegratedDataResponseDto.prototype, "data", void 0);
class SingleKeywordFullDataDto {
}
exports.SingleKeywordFullDataDto = SingleKeywordFullDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '검색어 (작년 어제부터 어제까지의 데이터를 자동으로 조회)',
        example: '맛집'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SingleKeywordFullDataDto.prototype, "keyword", void 0);
class MultipleKeywordsLimitedDataDto {
}
exports.MultipleKeywordsLimitedDataDto = MultipleKeywordsLimitedDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '검색어 목록 (최대 5개)',
        example: ['맛집', '카페', '레스토랑', '음식점', '디저트'],
        maxItems: 5
    }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], MultipleKeywordsLimitedDataDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시작 날짜 (YYYY-MM-DD)',
        example: api_constants_1.SEARCH_TREND_API.DEFAULT_DATE_RANGE.START_DATE,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultipleKeywordsLimitedDataDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '종료 날짜 (YYYY-MM-DD)',
        example: api_constants_1.SEARCH_TREND_API.DEFAULT_DATE_RANGE.END_DATE,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultipleKeywordsLimitedDataDto.prototype, "endDate", void 0);
class BatchRequestDto {
}
exports.BatchRequestDto = BatchRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '1번째 요청: 단일 키워드 전체 데이터' }),
    __metadata("design:type", SingleKeywordFullDataDto)
], BatchRequestDto.prototype, "firstRequest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '2번째 요청: 5개 키워드 제한 데이터' }),
    __metadata("design:type", MultipleKeywordsLimitedDataDto)
], BatchRequestDto.prototype, "secondRequest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '3번째 요청: 5개 키워드 제한 데이터' }),
    __metadata("design:type", MultipleKeywordsLimitedDataDto)
], BatchRequestDto.prototype, "thirdRequest", void 0);
class SingleKeywordFullDataResponseDto {
}
exports.SingleKeywordFullDataResponseDto = SingleKeywordFullDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], SingleKeywordFullDataResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], SingleKeywordFullDataResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드 전체 데이터' }),
    __metadata("design:type", Object)
], SingleKeywordFullDataResponseDto.prototype, "data", void 0);
class MultipleKeywordsLimitedDataResponseDto {
}
exports.MultipleKeywordsLimitedDataResponseDto = MultipleKeywordsLimitedDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], MultipleKeywordsLimitedDataResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], MultipleKeywordsLimitedDataResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '키워드별 제한 데이터' }),
    __metadata("design:type", Object)
], MultipleKeywordsLimitedDataResponseDto.prototype, "data", void 0);
class BatchResponseDto {
}
exports.BatchResponseDto = BatchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '성공 여부' }),
    __metadata("design:type", Boolean)
], BatchResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메시지' }),
    __metadata("design:type", String)
], BatchResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '배치 처리 결과' }),
    __metadata("design:type", Object)
], BatchResponseDto.prototype, "data", void 0);
//# sourceMappingURL=naver-api.dto.js.map