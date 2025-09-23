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
exports.NaverApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const api_retry_service_1 = require("../../common/services/api-retry.service");
const app_config_1 = require("../../config/app.config");
const api_constants_1 = require("../../constants/api.constants");
const keyword_data_service_1 = require("../keyword-analysis/domain/services/keyword-data.service");
const value_objects_1 = require("../keyword-analysis/domain/value-objects");
let NaverApiService = class NaverApiService {
    constructor(configService, apiRetryService, appConfig, keywordDataService) {
        this.configService = configService;
        this.apiRetryService = apiRetryService;
        this.appConfig = appConfig;
        this.keywordDataService = keywordDataService;
        this.appConfig.validateNaverApiKeys();
    }
    async searchBlogs(query, display = 10, start = 1, sort = 'sim') {
        try {
            console.log(`🔍 네이버 블로그 검색 API 호출: ${query}`);
            const response = await this.apiRetryService.executeNaverApiWithRetry(() => axios_1.default.get(`${this.appConfig.naverApiBaseUrl}${api_constants_1.NAVER_API.ENDPOINTS.BLOG_SEARCH}.json`, {
                headers: {
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
                    'User-Agent': api_constants_1.NAVER_API.HEADERS.USER_AGENT,
                },
                params: {
                    query,
                    display,
                    start,
                    sort,
                },
                timeout: this.appConfig.apiTimeoutMs,
            }), 'blog-search');
            console.log(`✅ 네이버 블로그 검색 완료: ${response.data.items?.length || 0}개 결과`);
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.searchBlogs 오류:', error);
            throw error;
        }
    }
    async searchCafes(query, display = 10, start = 1, sort = 'sim') {
        try {
            console.log(`☕ 네이버 카페 검색 API 호출: ${query}`);
            const response = await this.apiRetryService.executeNaverApiWithRetry(() => axios_1.default.get(`${this.appConfig.naverApiBaseUrl}/v1/search/cafearticle.json`, {
                headers: {
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
                    'User-Agent': api_constants_1.NAVER_API.HEADERS.USER_AGENT,
                },
                params: {
                    query,
                    display,
                    start,
                    sort,
                },
                timeout: this.appConfig.apiTimeoutMs,
            }), 'cafe-search');
            console.log(`✅ 네이버 카페 검색 완료: ${response.data.items?.length || 0}개 결과`);
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.searchCafes 오류:', error);
            throw error;
        }
    }
    async getDatalab(requestBody) {
        try {
            console.log(`📊 네이버 데이터랩 API 호출:`, requestBody);
            const response = await this.apiRetryService.executeNaverApiWithRetry(() => axios_1.default.post(`${this.appConfig.naverApiBaseUrl}${api_constants_1.NAVER_API.ENDPOINTS.SEARCH_TREND}`, requestBody, {
                headers: {
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
                    [api_constants_1.NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
                    'Content-Type': api_constants_1.NAVER_API.HEADERS.CONTENT_TYPE,
                    'User-Agent': api_constants_1.NAVER_API.HEADERS.USER_AGENT,
                },
                timeout: this.appConfig.apiExtendedTimeoutMs,
            }), 'datalab-search');
            console.log(`✅ 네이버 데이터랩 조회 완료: ${response.data.results?.length || 0}개 결과`);
            console.log('📊 네이버 데이터랩 API 전체 응답:', JSON.stringify(response.data, null, 2));
            if (response.data.results && response.data.results.length > 0) {
                const firstResult = response.data.results[0];
                console.log('🔍 첫 번째 결과 구조:', JSON.stringify(firstResult, null, 2));
                if (firstResult.gender || firstResult.genderRatio || firstResult.demographics) {
                    console.log('👥 성별 데이터 발견:', firstResult.gender || firstResult.genderRatio || firstResult.demographics);
                }
                if (firstResult.device || firstResult.deviceRatio || firstResult.platform) {
                    console.log('📱 디바이스 데이터 발견:', firstResult.device || firstResult.deviceRatio || firstResult.platform);
                }
            }
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.getDatalab 오류:', error);
            throw error;
        }
    }
    async getIntegratedData(query) {
        try {
            console.log(`🔄 통합 데이터 조회 시작: ${query}`);
            const [blogSearchResult, datalabResult] = await Promise.all([
                this.searchBlogs(query, 1, 1),
                this.getDatalab({
                    startDate: this.appConfig.defaultStartDate,
                    endDate: this.appConfig.defaultEndDate,
                    timeUnit: 'month',
                    keywordGroups: [
                        {
                            groupName: query,
                            keywords: [query],
                        },
                    ],
                }),
            ]);
            console.log(`✅ 통합 데이터 조회 완료: ${query}`);
            return {
                success: true,
                data: {
                    query,
                    blogSearch: blogSearchResult.data,
                    datalab: datalabResult.data,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.getIntegratedData 오류:', error);
            throw error;
        }
    }
    async getSingleKeywordFullData(request) {
        try {
            console.log(`🔍 단일 키워드 전체 데이터 조회 시작: ${request.keyword}`);
            const { startDate, endDate } = this.getDateRange();
            console.log(`📅 검색 기간: ${startDate} ~ ${endDate}`);
            const [blogSearchResult, generalDatalabResult, relatedKeywordsResult] = await Promise.all([
                this.searchBlogs(request.keyword, 5, 1, 'date'),
                this.getDatalab({
                    startDate,
                    endDate,
                    timeUnit: 'month',
                    keywordGroups: [
                        {
                            groupName: request.keyword,
                            keywords: [request.keyword],
                        },
                    ],
                }),
                this.getRelatedKeywords(request.keyword),
            ]);
            console.log(`✅ 단일 키워드 전체 데이터 조회 완료: ${request.keyword}`);
            return {
                success: true,
                data: {
                    keyword: request.keyword,
                    blogSearch: blogSearchResult.data,
                    datalab: generalDatalabResult.data,
                    relatedKeywords: relatedKeywordsResult.data,
                    searchPeriod: { startDate, endDate },
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.getSingleKeywordFullData 오류:', error);
            throw error;
        }
    }
    async getMultipleKeywordsLimitedData(request) {
        try {
            console.log(`📊 다중 키워드 제한 데이터 조회 시작: ${request.keywords.join(', ')}`);
            if (request.keywords.length > 5) {
                throw new Error('키워드는 최대 5개까지만 요청할 수 있습니다.');
            }
            const startDate = request.startDate || this.appConfig.defaultStartDate;
            const endDate = request.endDate || this.appConfig.defaultEndDate;
            const keywordResults = await Promise.all(request.keywords.map(async (keyword) => {
                try {
                    const [generalResult, blogSearchResult] = await Promise.all([
                        this.getDatalab({
                            startDate,
                            endDate,
                            timeUnit: 'month',
                            keywordGroups: [
                                {
                                    groupName: keyword,
                                    keywords: [keyword],
                                },
                            ],
                        }),
                        this.searchBlogs(keyword, 1, 1),
                    ]);
                    const processedData = this.processLimitedKeywordData(keyword, generalResult.data, blogSearchResult.data);
                    return processedData;
                }
                catch (error) {
                    console.error(`❌ 키워드 "${keyword}" 처리 중 오류:`, error);
                    return {
                        keyword,
                        monthlySearchVolume: 0,
                        cumulativePublications: 0,
                        error: error.message,
                    };
                }
            }));
            console.log(`✅ 다중 키워드 제한 데이터 조회 완료: ${request.keywords.length}개 키워드`);
            return {
                success: true,
                data: {
                    keywords: request.keywords,
                    results: keywordResults,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.getMultipleKeywordsLimitedData 오류:', error);
            throw error;
        }
    }
    async processBatchRequest(request) {
        try {
            console.log('🚀 배치 요청 처리 시작');
            const startTime = Date.now();
            const [firstResult, secondResult, thirdResult] = await Promise.all([
                this.getSingleKeywordFullData(request.firstRequest),
                this.getMultipleKeywordsLimitedData(request.secondRequest),
                this.getMultipleKeywordsLimitedData(request.thirdRequest),
            ]);
            const endTime = Date.now();
            const totalProcessingTime = endTime - startTime;
            console.log(`✅ 배치 요청 처리 완료 (${totalProcessingTime}ms)`);
            return {
                success: true,
                data: {
                    firstResult: firstResult.data,
                    secondResult: secondResult.data,
                    thirdResult: thirdResult.data,
                    totalProcessingTime,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.processBatchRequest 오류:', error);
            throw error;
        }
    }
    async getRelatedKeywords(keyword) {
        try {
            console.log(`🔗 연관 검색어 조회: ${keyword}`);
            return {
                success: true,
                data: {
                    keyword,
                    relatedKeywords: [],
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            console.error('❌ 연관 검색어 조회 오류:', error);
            return {
                success: false,
                data: {
                    keyword,
                    relatedKeywords: [],
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    processLimitedKeywordData(keyword, generalData, blogSearchData) {
        try {
            const monthlySearchVolume = this.calculateMonthlySearchVolume(generalData);
            const cumulativePublications = blogSearchData.total || 0;
            console.log(`📊 키워드 "${keyword}" 데이터 가공 완료:`, {
                monthlySearchVolume,
                cumulativePublications,
            });
            return {
                keyword,
                monthlySearchVolume,
                cumulativePublications,
            };
        }
        catch (error) {
            console.error(`❌ 키워드 데이터 가공 오류 (${keyword}):`, error);
            return {
                keyword,
                monthlySearchVolume: 0,
                cumulativePublications: 0,
            };
        }
    }
    calculateMonthlySearchVolume(datalabData) {
        try {
            if (datalabData.results && datalabData.results.length > 0) {
                const latestData = datalabData.results[0].data;
                if (latestData && latestData.length > 0) {
                    return latestData[latestData.length - 1].ratio * 100;
                }
            }
            return 0;
        }
        catch (error) {
            console.error('❌ 월간검색량 계산 오류:', error);
            return 0;
        }
    }
    async getContentCounts(query) {
        try {
            console.log(`📊 키워드 "${query}" 콘텐츠 수 조회 시작`);
            const [blogResult, cafeResult] = await Promise.all([
                this.searchBlogs(query, 1, 1),
                this.searchCafes(query, 1, 1),
            ]);
            const contentCounts = {
                keyword: query,
                searchedAt: new Date(),
                counts: {
                    blogs: blogResult.data.total || 0,
                    cafes: cafeResult.data.total || 0,
                    total: (blogResult.data.total || 0) + (cafeResult.data.total || 0),
                }
            };
            console.log(`✅ 콘텐츠 수 조회 완료:`, contentCounts.counts);
            return { success: true, data: contentCounts };
        }
        catch (error) {
            console.error('❌ NaverApiService.getContentCounts 오류:', error);
            throw error;
        }
    }
    async getContentCountsAndSave(query) {
        try {
            console.log(`💾 키워드 "${query}" 콘텐츠 수 조회 및 저장 시작`);
            const contentResult = await this.getContentCounts(query);
            const keyword = new value_objects_1.Keyword(query);
            const analysisDate = new value_objects_1.AnalysisDate();
            const savedAnalytics = await this.keywordDataService.saveContentCounts(keyword, analysisDate, {
                blogs: contentResult.data.counts.blogs,
                cafes: contentResult.data.counts.cafes,
                total: contentResult.data.counts.total,
            });
            console.log(`✅ 콘텐츠 수 데이터 저장 완료: ${query}`, {
                id: savedAnalytics.id,
                blogs: savedAnalytics.monthlyContentBlog,
                cafes: savedAnalytics.monthlyContentCafe,
                total: savedAnalytics.monthlyContentAll,
            });
            return {
                success: true,
                data: {
                    keyword: query,
                    searchedAt: contentResult.data.searchedAt,
                    counts: contentResult.data.counts,
                    savedToDatabase: {
                        id: savedAnalytics.id,
                        analysisDate: savedAnalytics.analysisDate,
                        monthlyContentBlog: savedAnalytics.monthlyContentBlog,
                        monthlyContentCafe: savedAnalytics.monthlyContentCafe,
                        monthlyContentAll: savedAnalytics.monthlyContentAll,
                    }
                },
                message: `키워드 "${query}" 콘텐츠 수 조회 및 데이터베이스 저장이 완료되었습니다.`
            };
        }
        catch (error) {
            console.error('❌ NaverApiService.getContentCountsAndSave 오류:', error);
            throw error;
        }
    }
    getDateRange() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const lastYearYesterday = new Date(yesterday);
        lastYearYesterday.setFullYear(yesterday.getFullYear() - 1);
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const startDate = formatDate(lastYearYesterday);
        const endDate = formatDate(yesterday);
        return { startDate, endDate };
    }
};
exports.NaverApiService = NaverApiService;
exports.NaverApiService = NaverApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        api_retry_service_1.ApiRetryService,
        app_config_1.AppConfigService,
        keyword_data_service_1.KeywordDataService])
], NaverApiService);
//# sourceMappingURL=naver-api.service.js.map