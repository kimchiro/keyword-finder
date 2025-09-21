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
let NaverApiService = class NaverApiService {
    constructor(configService) {
        this.configService = configService;
        this.naverClientId = this.configService.get('NAVER_CLIENT_ID');
        this.naverClientSecret = this.configService.get('NAVER_CLIENT_SECRET');
    }
    async searchBlogs(query, display = 10, start = 1, sort = 'sim') {
        try {
            if (!this.naverClientId || !this.naverClientSecret) {
                throw new Error('네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
            }
            console.log(`🔍 네이버 블로그 검색 API 호출: ${query}`);
            const response = await axios_1.default.get('https://openapi.naver.com/v1/search/blog.json', {
                headers: {
                    'X-Naver-Client-Id': this.naverClientId,
                    'X-Naver-Client-Secret': this.naverClientSecret,
                },
                params: {
                    query,
                    display,
                    start,
                    sort,
                },
                timeout: 10000,
            });
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
            if (!this.naverClientId || !this.naverClientSecret) {
                throw new Error('네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
            }
            console.log(`📊 네이버 데이터랩 API 호출:`, requestBody);
            const response = await axios_1.default.post('https://openapi.naver.com/v1/datalab/search', requestBody, {
                headers: {
                    'X-Naver-Client-Id': this.naverClientId,
                    'X-Naver-Client-Secret': this.naverClientSecret,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });
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
                this.searchBlogs(query, 20, 1),
                this.getDatalab({
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], NaverApiService);
//# sourceMappingURL=naver-api.service.js.map