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
exports.NaverApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const naver_api_service_1 = require("./naver-api.service");
const naver_api_dto_1 = require("./dto/naver-api.dto");
let NaverApiController = class NaverApiController {
    constructor(naverApiService) {
        this.naverApiService = naverApiService;
    }
    async searchBlog(query, display, start, sort) {
        try {
            console.log(`🔍 네이버 블로그 검색: ${query}`);
            const result = await this.naverApiService.searchBlogs(query, display, start, sort);
            return {
                success: true,
                message: '블로그 검색이 완료되었습니다.',
                data: result.data,
            };
        }
        catch (error) {
            console.error('❌ 블로그 검색 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '블로그 검색 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDatalabTrend(requestBody) {
        try {
            console.log(`📈 네이버 데이터랩 트렌드 조회:`, requestBody);
            const result = await this.naverApiService.getDatalab(requestBody);
            return {
                success: true,
                message: '트렌드 데이터 조회가 완료되었습니다.',
                data: result.data,
            };
        }
        catch (error) {
            console.error('❌ 트렌드 조회 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '트렌드 조회 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getIntegratedData(query) {
        try {
            console.log(`📊 통합 데이터 조회: ${query}`);
            const result = await this.naverApiService.getIntegratedData(query);
            return {
                success: true,
                message: '통합 데이터 조회가 완료되었습니다.',
                data: result.data,
            };
        }
        catch (error) {
            console.error('❌ 통합 데이터 조회 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '통합 데이터 조회 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NaverApiController = NaverApiController;
__decorate([
    (0, common_1.Get)('blog-search'),
    (0, swagger_1.ApiOperation)({
        summary: '네이버 블로그 검색',
        description: '네이버 블로그 검색 API를 통해 블로그 포스트를 검색합니다.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        description: '검색어',
        example: '맛집'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'display',
        description: '검색 결과 개수 (1-100)',
        example: 10,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start',
        description: '검색 시작 위치 (1-1000)',
        example: 1,
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        description: '정렬 방식 (sim: 정확도순, date: 날짜순)',
        example: 'sim',
        required: false
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '검색 성공',
        type: naver_api_dto_1.BlogSearchResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '서버 오류',
    }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('display')),
    __param(2, (0, common_1.Query)('start')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], NaverApiController.prototype, "searchBlog", null);
__decorate([
    (0, common_1.Post)('datalab'),
    (0, swagger_1.ApiOperation)({
        summary: '네이버 데이터랩 트렌드 조회',
        description: '네이버 데이터랩 API를 통해 검색 트렌드를 조회합니다.'
    }),
    (0, swagger_1.ApiBody)({ type: naver_api_dto_1.DatalabTrendDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '트렌드 조회 성공',
        type: naver_api_dto_1.DatalabTrendResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '잘못된 요청',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '서버 오류',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NaverApiController.prototype, "getDatalabTrend", null);
__decorate([
    (0, common_1.Get)('integrated-data/:query'),
    (0, swagger_1.ApiOperation)({
        summary: '통합 데이터 조회',
        description: '블로그 검색과 트렌드 데이터를 통합하여 조회합니다.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'query',
        description: '검색어',
        example: '맛집'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '통합 데이터 조회 성공',
        type: naver_api_dto_1.IntegratedDataResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '서버 오류',
    }),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NaverApiController.prototype, "getIntegratedData", null);
exports.NaverApiController = NaverApiController = __decorate([
    (0, swagger_1.ApiTags)('naver-api'),
    (0, common_1.Controller)('naver'),
    __metadata("design:paramtypes", [naver_api_service_1.NaverApiService])
], NaverApiController);
//# sourceMappingURL=naver-api.controller.js.map