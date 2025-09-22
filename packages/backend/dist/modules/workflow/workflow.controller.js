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
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflow_service_1 = require("./workflow.service");
let WorkflowController = class WorkflowController {
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async executeCompleteWorkflow(query) {
        try {
            console.log(`🚀 완전한 워크플로우 API 호출: ${query}`);
            const result = await this.workflowService.executeCompleteWorkflow(query);
            if (!result.success) {
                throw new common_1.HttpException({
                    success: false,
                    message: result.message,
                    data: result.data,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return result;
        }
        catch (error) {
            console.error('❌ 완전한 워크플로우 API 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '워크플로우 실행 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async executeQuickAnalysis(query) {
        try {
            console.log(`⚡ 빠른 분석 API 호출: ${query}`);
            const result = await this.workflowService.executeQuickAnalysis(query);
            return result;
        }
        catch (error) {
            console.error('❌ 빠른 분석 API 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '빠른 분석 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async executeScrapingOnly(query) {
        try {
            console.log(`🕷️ 스크래핑 전용 API 호출: ${query}`);
            const result = await this.workflowService.executeScrapingOnly(query);
            return result;
        }
        catch (error) {
            console.error('❌ 스크래핑 전용 API 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '스크래핑 워크플로우 실행 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkWorkflowHealth() {
        try {
            const healthStatus = await this.workflowService.checkWorkflowHealth();
            return {
                success: true,
                message: '워크플로우 상태 체크 완료',
                data: healthStatus,
            };
        }
        catch (error) {
            console.error('❌ 워크플로우 상태 체크 실패:', error);
            throw new common_1.HttpException({
                success: false,
                message: '워크플로우 상태 체크 중 오류가 발생했습니다.',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)('complete/:query'),
    (0, swagger_1.ApiOperation)({
        summary: '완전한 키워드 분석 워크플로우 실행 (새로운 순서)',
        description: `
    프론트엔드 검색창에서 키워드 입력 시 실행되는 새로운 워크플로우:
    1. 스크래핑 실행 (스마트블록, 연관검색어)
    2. 스크래핑 데이터를 데이터베이스에 저장
    3. DB에서 rank 1-5 키워드 추출 (스마트블록 우선, 연관검색어 보완)
    4. 네이버 API 3번 호출:
       - API 호출 1: 원본 키워드(1개) 단독 호출
       - API 호출 2: 추출된 키워드 첫 번째 배치(최대 5개) 데이터랩 조회
       - API 호출 3: 추출된 키워드 두 번째 배치(추가 5개) 데이터랩 조회
    5. 통합된 분석 결과를 프론트엔드에 반환
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'query',
        description: '분석할 키워드',
        example: '맛집',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '워크플로우 실행 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '키워드 분석 워크플로우가 성공적으로 완료되었습니다.' },
                data: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', example: '맛집' },
                        naverApiData: {
                            type: 'object',
                            properties: {
                                original: {
                                    type: 'object',
                                    description: '원본 키워드 네이버 API 데이터 (블로그 검색 + 데이터랩)',
                                },
                                firstBatch: {
                                    type: 'object',
                                    description: '추출된 키워드 첫 번째 배치(최대 5개) 데이터랩 트렌드 데이터',
                                },
                                secondBatch: {
                                    type: 'object',
                                    description: '추출된 키워드 두 번째 배치(추가 5개) 데이터랩 트렌드 데이터',
                                },
                            },
                        },
                        scrapingData: {
                            type: 'object',
                            description: '스크래핑된 키워드 데이터',
                        },
                        analysisData: {
                            type: 'object',
                            description: '키워드 분석 결과',
                        },
                        topKeywords: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'DB에서 추출된 상위 5개 키워드',
                            example: ['맛집 추천', '맛집 리스트', '맛집 후기', '맛집 검색', '맛집 정보'],
                        },
                        keywordsWithRank: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    keyword: { type: 'string', example: '맛집 추천' },
                                    originalRank: { type: 'number', example: 1 },
                                    category: { type: 'string', example: 'smartblock' },
                                    source: { type: 'string', example: 'naver_smartblock' },
                                },
                            },
                            description: 'DB에서 추출된 키워드의 상세 rank 정보',
                            example: [
                                { keyword: '맛집 추천', originalRank: 1, category: 'smartblock', source: 'naver_smartblock' },
                                { keyword: '맛집 리스트', originalRank: 2, category: 'smartblock', source: 'naver_smartblock' },
                                { keyword: '맛집 후기', originalRank: 3, category: 'smartblock', source: 'naver_smartblock' },
                                { keyword: '서울 맛집', originalRank: 1, category: 'related_search', source: 'naver_related_search' },
                                { keyword: '부산 맛집', originalRank: 2, category: 'related_search', source: 'naver_related_search' },
                            ],
                        },
                        executionTime: { type: 'number', example: 15.2 },
                        timestamp: { type: 'string', example: '2025-09-21T08:30:00.000Z' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: '워크플로우 실행 실패',
    }),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "executeCompleteWorkflow", null);
__decorate([
    (0, common_1.Post)('quick/:query'),
    (0, swagger_1.ApiOperation)({
        summary: '빠른 키워드 분석',
        description: `
    스크래핑 없이 빠른 분석 수행:
    1. 네이버 API 호출 (블로그 검색 + 데이터랩)
    2. 기존 분석 데이터 조회
    3. 즉시 결과 반환 (스크래핑 제외)
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'query',
        description: '분석할 키워드',
        example: '맛집',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '빠른 분석 성공',
    }),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "executeQuickAnalysis", null);
__decorate([
    (0, common_1.Post)('scraping/:query'),
    (0, swagger_1.ApiOperation)({
        summary: '스크래핑 전용 워크플로우',
        description: `
    키워드 스크래핑만 수행:
    1. Playwright 기반 네이버 스크래핑
    2. 자동완성, 연관검색어, 인기주제, 스마트블록 데이터 수집
    3. 데이터베이스 저장
    4. 스크래핑 결과 반환
    `,
    }),
    (0, swagger_1.ApiParam)({
        name: 'query',
        description: '스크래핑할 키워드',
        example: '맛집',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '스크래핑 성공',
    }),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "executeScrapingOnly", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: '워크플로우 상태 체크',
        description: '모든 워크플로우 구성 요소의 상태를 확인합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '상태 체크 완료',
        schema: {
            type: 'object',
            properties: {
                naverApi: { type: 'boolean', example: true },
                scraping: { type: 'boolean', example: true },
                analysis: { type: 'boolean', example: true },
                overall: { type: 'boolean', example: true },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "checkWorkflowHealth", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, swagger_1.ApiTags)('Workflow', '키워드 분석 워크플로우'),
    (0, common_1.Controller)('workflow'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map