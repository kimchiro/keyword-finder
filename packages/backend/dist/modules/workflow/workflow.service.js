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
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const naver_api_service_1 = require("../naver-api/naver-api.service");
const scraping_service_1 = require("../scraping/scraping.service");
const keyword_analysis_service_1 = require("../keyword-analysis/keyword-analysis.service");
let WorkflowService = class WorkflowService {
    constructor(naverApiService, scrapingService, keywordAnalysisService) {
        this.naverApiService = naverApiService;
        this.scrapingService = scrapingService;
        this.keywordAnalysisService = keywordAnalysisService;
    }
    async executeCompleteWorkflow(query) {
        const startTime = Date.now();
        console.log(`🚀 완전한 워크플로우 시작: ${query}`);
        try {
            console.log(`⚡ Phase 1: API 호출 및 스크래핑 병렬 실행`);
            const [naverApiResult, scrapingResult] = await Promise.allSettled([
                this.naverApiService.getIntegratedData(query),
                this.scrapingService.scrapeKeywords({
                    query,
                    types: ['related_search'],
                    maxResults: 50,
                }),
            ]);
            const naverApiData = naverApiResult.status === 'fulfilled'
                ? naverApiResult.value.data
                : null;
            const scrapingData = scrapingResult.status === 'fulfilled'
                ? scrapingResult.value
                : null;
            if (naverApiResult.status === 'rejected') {
                console.warn('⚠️ 네이버 API 호출 실패:', naverApiResult.reason);
            }
            if (scrapingResult.status === 'rejected') {
                console.warn('⚠️ 스크래핑 실패:', scrapingResult.reason);
            }
            console.log(`📊 Phase 2: 연관 키워드 및 분석 데이터 생성`);
            let analysisData = null;
            try {
                let relatedKeywordsData = [];
                if (scrapingData?.keywords) {
                    const relatedSearchKeywords = scrapingData.keywords
                        .filter(k => k.category === 'related_search')
                        .slice(0, 10)
                        .map(k => k.keyword);
                    if (relatedSearchKeywords.length > 0) {
                        try {
                            console.log(`🔗 연관검색어 트렌드 조회: ${relatedSearchKeywords.join(', ')}`);
                            const keywordGroups = [
                                {
                                    groupName: query,
                                    keywords: [query],
                                },
                                ...relatedSearchKeywords.slice(0, 4).map((keyword, index) => ({
                                    groupName: `연관키워드${index + 1}`,
                                    keywords: [keyword],
                                })),
                            ];
                            const datalabResult = await this.naverApiService.getDatalab({
                                startDate: '2024-01-01',
                                endDate: '2024-12-31',
                                timeUnit: 'month',
                                keywordGroups,
                            });
                            relatedKeywordsData = relatedSearchKeywords.map((keyword, index) => {
                                const trendData = datalabResult.data?.results?.find((result) => result.title === `연관키워드${index + 1}`);
                                const latestRatio = trendData?.data?.[trendData.data.length - 1]?.ratio || 0;
                                return {
                                    keyword,
                                    monthlySearchVolume: latestRatio,
                                    rankPosition: index + 1,
                                    trendData: trendData?.data || []
                                };
                            });
                            console.log(`✅ 연관검색어 트렌드 조회 완료: ${relatedKeywordsData.length}개`);
                        }
                        catch (relatedError) {
                            console.warn('⚠️ 연관검색어 트렌드 조회 실패:', relatedError);
                        }
                    }
                }
                const analysisResult = await this.keywordAnalysisService.analyzeKeyword(query, undefined, naverApiData, relatedKeywordsData);
                analysisData = analysisResult;
            }
            catch (analysisError) {
                console.warn('⚠️ 키워드 분석 실패:', analysisError);
            }
            const executionTime = (Date.now() - startTime) / 1000;
            console.log(`✅ 완전한 워크플로우 완료: ${query} (${executionTime}초)`);
            return {
                success: true,
                data: {
                    query,
                    naverApiData,
                    scrapingData,
                    analysisData,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: '키워드 분석 워크플로우가 성공적으로 완료되었습니다.',
            };
        }
        catch (error) {
            const executionTime = (Date.now() - startTime) / 1000;
            console.error('❌ 워크플로우 실행 실패:', error);
            return {
                success: false,
                data: {
                    query,
                    naverApiData: null,
                    scrapingData: null,
                    analysisData: null,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: `워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
            };
        }
    }
    async executeQuickAnalysis(query) {
        const startTime = Date.now();
        console.log(`⚡ 빠른 분석 시작: ${query}`);
        try {
            const naverApiResult = await this.naverApiService.getIntegratedData(query);
            const executionTime = (Date.now() - startTime) / 1000;
            console.log(`✅ 빠른 분석 완료: ${query} (${executionTime}초)`);
            return {
                success: true,
                data: {
                    query,
                    naverApiData: naverApiResult.data,
                    scrapingData: null,
                    analysisData: null,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: '빠른 키워드 분석이 완료되었습니다.',
            };
        }
        catch (error) {
            const executionTime = (Date.now() - startTime) / 1000;
            console.error('❌ 빠른 분석 실패:', error);
            return {
                success: false,
                data: {
                    query,
                    naverApiData: null,
                    scrapingData: null,
                    analysisData: null,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: `빠른 분석 중 오류가 발생했습니다: ${error.message}`,
            };
        }
    }
    async executeScrapingOnly(query) {
        const startTime = Date.now();
        console.log(`🕷️ 스크래핑 전용 워크플로우 시작: ${query}`);
        try {
            const scrapingResult = await this.scrapingService.scrapeKeywords({
                query,
                types: ['trending', 'smartblock'],
                maxResults: 100,
            });
            const executionTime = (Date.now() - startTime) / 1000;
            console.log(`✅ 스크래핑 전용 워크플로우 완료: ${query} (${executionTime}초)`);
            return {
                success: true,
                data: {
                    query,
                    naverApiData: null,
                    scrapingData: scrapingResult,
                    analysisData: null,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: '키워드 스크래핑이 완료되었습니다.',
            };
        }
        catch (error) {
            const executionTime = (Date.now() - startTime) / 1000;
            console.error('❌ 스크래핑 워크플로우 실패:', error);
            return {
                success: false,
                data: {
                    query,
                    naverApiData: null,
                    scrapingData: null,
                    analysisData: null,
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: `스크래핑 워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
            };
        }
    }
    async checkWorkflowHealth() {
        console.log('🔍 워크플로우 상태 체크 시작');
        const healthChecks = await Promise.allSettled([
            this.naverApiService.getIntegratedData('테스트').catch(() => false),
            this.scrapingService.getScrapingStats().catch(() => false),
            this.keywordAnalysisService.getKeywordAnalysis('테스트').catch(() => false),
        ]);
        const naverApi = healthChecks[0].status === 'fulfilled' && healthChecks[0].value !== false;
        const scraping = healthChecks[1].status === 'fulfilled' && healthChecks[1].value !== false;
        const analysis = healthChecks[2].status === 'fulfilled' && healthChecks[2].value !== false;
        const overall = naverApi && scraping && analysis;
        console.log(`📊 워크플로우 상태: API(${naverApi}), 스크래핑(${scraping}), 분석(${analysis}), 전체(${overall})`);
        return {
            naverApi,
            scraping,
            analysis,
            overall,
        };
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [naver_api_service_1.NaverApiService,
        scraping_service_1.ScrapingService,
        keyword_analysis_service_1.KeywordAnalysisService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map