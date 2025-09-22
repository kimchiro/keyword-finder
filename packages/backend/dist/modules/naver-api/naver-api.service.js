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
let NaverApiService = class NaverApiService {
    constructor(configService, apiRetryService, appConfig) {
        this.configService = configService;
        this.apiRetryService = apiRetryService;
        this.appConfig = appConfig;
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
};
exports.NaverApiService = NaverApiService;
exports.NaverApiService = NaverApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        api_retry_service_1.ApiRetryService,
        app_config_1.AppConfigService])
], NaverApiService);
//# sourceMappingURL=naver-api.service.js.map