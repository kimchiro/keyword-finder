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
const app_config_1 = require("../../config/app.config");
let WorkflowService = class WorkflowService {
    constructor(naverApiService, scrapingService, keywordAnalysisService, appConfig) {
        this.naverApiService = naverApiService;
        this.scrapingService = scrapingService;
        this.keywordAnalysisService = keywordAnalysisService;
        this.appConfig = appConfig;
    }
    async executeCompleteWorkflow(query) {
        const startTime = Date.now();
        console.log(`🚀 새로운 워크플로우 시작: ${query}`);
        try {
            console.log(`🕷️ Phase 1: 스크래핑 실행`);
            const scrapingResult = await this.scrapingService.scrapeKeywords({
                query,
                types: ['smartblock', 'related_search'],
                maxResults: this.appConfig.scrapingMaxResults,
            });
            if (!scrapingResult || !scrapingResult.keywords) {
                throw new Error('스크래핑 데이터를 가져올 수 없습니다.');
            }
            console.log(`✅ 스크래핑 완료: ${scrapingResult.keywords.length}개 키워드`);
            console.log(`💾 Phase 2: 스크래핑 데이터 DB 저장`);
            await this.keywordAnalysisService.saveScrapingData(query, scrapingResult);
            console.log(`🔍 Phase 3: DB에서 상위 5개 키워드 추출`);
            const extractedData = await this.extractTopKeywordsFromDB(query);
            const topKeywords = extractedData.keywords;
            const keywordsWithRank = extractedData.keywordsWithRank;
            if (topKeywords.length === 0) {
                console.warn('⚠️ 추출된 키워드가 없습니다. 원본 키워드만 사용합니다.');
            }
            console.log(`🌐 Phase 4: 네이버 API 호출 시작`);
            console.log(`📞 API 호출 1: 원본 키워드 "${query}" (통합 데이터 + 콘텐츠 수)`);
            const [originalKeywordApiResult, contentCountsResult] = await Promise.all([
                this.naverApiService.getIntegratedData(query),
                this.naverApiService.getContentCounts(query)
            ]);
            let firstBatchApiResult = null;
            let secondBatchApiResult = null;
            let firstBatchDemographicData = null;
            let secondBatchDemographicData = null;
            if (topKeywords.length > 0) {
                const firstBatch = topKeywords.slice(0, 5);
                if (firstBatch.length > 0) {
                    console.log(`📞 API 호출 2: 첫 번째 배치 키워드 ${firstBatch.length}개 - ${firstBatch.join(', ')}`);
                    const keywordGroups1 = firstBatch.map((keyword, index) => ({
                        groupName: `키워드${index + 1}`,
                        keywords: [keyword],
                    }));
                    const [generalResult, genderResult, deviceResult, ageResult] = await Promise.all([
                        this.naverApiService.getDatalab({
                            startDate: this.appConfig.defaultStartDate,
                            endDate: this.appConfig.defaultEndDate,
                            timeUnit: 'month',
                            keywordGroups: keywordGroups1,
                        }),
                        this.naverApiService.getDatalab({
                            startDate: this.appConfig.defaultStartDate,
                            endDate: this.appConfig.defaultEndDate,
                            timeUnit: 'month',
                            category: 'gender',
                            keywordGroups: keywordGroups1,
                        }).catch(error => {
                            console.warn(`⚠️ 첫 번째 배치 성별 데이터 수집 실패:`, error.message);
                            return null;
                        }),
                        this.naverApiService.getDatalab({
                            startDate: this.appConfig.defaultStartDate,
                            endDate: this.appConfig.defaultEndDate,
                            timeUnit: 'month',
                            category: 'device',
                            keywordGroups: keywordGroups1,
                        }).catch(error => {
                            console.warn(`⚠️ 첫 번째 배치 디바이스 데이터 수집 실패:`, error.message);
                            return null;
                        }),
                        this.naverApiService.getDatalab({
                            startDate: this.appConfig.defaultStartDate,
                            endDate: this.appConfig.defaultEndDate,
                            timeUnit: 'month',
                            category: 'age',
                            keywordGroups: keywordGroups1,
                        }).catch(error => {
                            console.warn(`⚠️ 첫 번째 배치 연령 데이터 수집 실패:`, error.message);
                            return null;
                        }),
                    ]);
                    firstBatchApiResult = generalResult;
                    firstBatchDemographicData = {
                        gender: genderResult,
                        device: deviceResult,
                        age: ageResult,
                    };
                    console.log(`✅ 첫 번째 배치 데이터 수집 완료 - 일반: ${generalResult ? '성공' : '실패'}, 성별: ${genderResult ? '성공' : '실패'}, 디바이스: ${deviceResult ? '성공' : '실패'}, 연령: ${ageResult ? '성공' : '실패'}`);
                }
                const secondBatch = topKeywords.slice(5, 10);
                if (secondBatch.length > 0) {
                    console.log(`📞 API 호출 3: 두 번째 배치 키워드 ${secondBatch.length}개 - ${secondBatch.join(', ')}`);
                    const keywordGroups2 = secondBatch.map((keyword, index) => ({
                        groupName: `키워드${index + 6}`,
                        keywords: [keyword],
                    }));
                    const generalResult = await this.naverApiService.getDatalab({
                        startDate: this.appConfig.defaultStartDate,
                        endDate: this.appConfig.defaultEndDate,
                        timeUnit: 'month',
                        keywordGroups: keywordGroups2,
                    });
                    secondBatchApiResult = generalResult;
                    secondBatchDemographicData = null;
                    console.log(`✅ 두 번째 배치 데이터 수집 완료 - 일반: ${generalResult ? '성공' : '실패'}`);
                }
            }
            console.log(`✅ 네이버 API 호출 완료 - 총 ${topKeywords.length > 5 ? 3 : topKeywords.length > 0 ? 2 : 1}번 호출`);
            console.log(`📊 Phase 5: 키워드 분석 데이터 생성`);
            const relatedKeywordsData = topKeywords.map((keyword, index) => {
                let trendData = null;
                if (index < 5 && firstBatchApiResult?.data?.results) {
                    trendData = firstBatchApiResult.data.results.find((result) => result.title === `키워드${index + 1}`);
                }
                else if (index >= 5 && secondBatchApiResult?.data?.results) {
                    trendData = secondBatchApiResult.data.results.find((result) => result.title === `키워드${index + 1}`);
                }
                const latestRatio = trendData?.data?.[trendData.data.length - 1]?.ratio || 0;
                return {
                    keyword,
                    monthlySearchVolume: latestRatio,
                    rankPosition: index + 1,
                    trendData: trendData?.data || []
                };
            });
            const enhancedNaverApiData = {
                ...originalKeywordApiResult.data,
                demographicData: {
                    firstBatch: firstBatchDemographicData,
                    secondBatch: secondBatchDemographicData,
                }
            };
            const analysisData = await this.keywordAnalysisService.analyzeKeyword(query, undefined, enhancedNaverApiData, relatedKeywordsData);
            const executionTime = (Date.now() - startTime) / 1000;
            console.log(`✅ 새로운 워크플로우 완료: ${query} (${executionTime}초)`);
            return {
                success: true,
                data: {
                    query,
                    naverApiData: {
                        original: originalKeywordApiResult.data,
                        firstBatch: firstBatchApiResult?.data || null,
                        secondBatch: secondBatchApiResult?.data || null,
                        demographicData: {
                            firstBatch: firstBatchDemographicData,
                            secondBatch: secondBatchDemographicData,
                        },
                    },
                    contentCounts: contentCountsResult.data,
                    scrapingData: scrapingResult,
                    analysisData,
                    topKeywords,
                    keywordsWithRank,
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
                    topKeywords: [],
                    keywordsWithRank: [],
                    executionTime,
                    timestamp: new Date().toISOString(),
                },
                message: `워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
            };
        }
    }
    async extractTopKeywordsFromDB(query) {
        try {
            const savedData = await this.keywordAnalysisService.getScrapedKeywords(query);
            if (!savedData || savedData.length === 0) {
                return { keywords: [], keywordsWithRank: [] };
            }
            const smartblockItems = savedData
                .filter(item => item.category === 'smartblock' && item.rankPosition >= 1 && item.rankPosition <= 5)
                .sort((a, b) => a.rankPosition - b.rankPosition);
            const relatedSearchItems = savedData
                .filter(item => item.category === 'related_search' && item.rankPosition >= 1 && item.rankPosition <= 5)
                .sort((a, b) => a.rankPosition - b.rankPosition);
            const topKeywordsWithRank = [...smartblockItems];
            if (topKeywordsWithRank.length < 5) {
                const remainingSlots = 5 - topKeywordsWithRank.length;
                const additionalItems = relatedSearchItems
                    .filter(item => !topKeywordsWithRank.some(existing => existing.keyword === item.keyword))
                    .slice(0, remainingSlots);
                topKeywordsWithRank.push(...additionalItems);
            }
            const finalKeywordsWithRank = topKeywordsWithRank.slice(0, 5);
            const keywords = finalKeywordsWithRank.map(item => item.keyword);
            const keywordsWithRank = finalKeywordsWithRank.map(item => ({
                keyword: item.keyword,
                originalRank: item.rankPosition,
                category: item.category,
                source: item.category === 'smartblock' ? 'naver_smartblock' : 'naver_related_search',
            }));
            console.log(`🎯 추출된 상위 키워드: ${keywords.join(', ')}`);
            return { keywords, keywordsWithRank };
        }
        catch (error) {
            console.error('❌ DB에서 키워드 추출 실패:', error);
            return { keywords: [], keywordsWithRank: [] };
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
                    topKeywords: [],
                    keywordsWithRank: [],
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
                    topKeywords: [],
                    keywordsWithRank: [],
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
                maxResults: this.appConfig.scrapingMaxResults * 2,
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
                    topKeywords: [],
                    keywordsWithRank: [],
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
                    topKeywords: [],
                    keywordsWithRank: [],
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
        keyword_analysis_service_1.KeywordAnalysisService,
        app_config_1.AppConfigService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map