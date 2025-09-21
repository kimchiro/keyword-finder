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
exports.KeywordAnalysisDomainService = void 0;
const common_1 = require("@nestjs/common");
const value_objects_1 = require("../value-objects");
const keyword_data_service_1 = require("./keyword-data.service");
const chart_data_service_1 = require("./chart-data.service");
const keyword_analysis_aggregate_1 = require("../aggregates/keyword-analysis.aggregate");
let KeywordAnalysisDomainService = class KeywordAnalysisDomainService {
    constructor(keywordDataService, chartDataService) {
        this.keywordDataService = keywordDataService;
        this.chartDataService = chartDataService;
    }
    async analyzeKeyword(keywordValue, analysisDateValue, naverApiData, relatedKeywordsData) {
        console.log(`📊 키워드 분석 시작: ${keywordValue}`);
        const keyword = new value_objects_1.Keyword(keywordValue);
        const analysisDate = new value_objects_1.AnalysisDate(analysisDateValue);
        const existingAnalytics = await this.keywordDataService.findKeywordAnalyticsByDate(keyword, analysisDate);
        if (existingAnalytics) {
            console.log(`⚠️ 키워드 '${keywordValue}'에 대한 분석 데이터가 이미 존재합니다. 기존 데이터를 반환합니다.`);
            return await this.getExistingAnalysis(keyword, analysisDate);
        }
        const searchVolume = this.extractSearchVolume(naverApiData);
        const analytics = await this.keywordDataService.saveKeywordAnalytics(keyword, analysisDate, searchVolume, naverApiData);
        const relatedKeywords = await this.keywordDataService.saveRelatedKeywords(keyword, analysisDate, relatedKeywordsData || []);
        const chartData = await this.chartDataService.saveChartData(keyword, analysisDate, naverApiData);
        console.log(`✅ 키워드 분석 완료: ${keywordValue}`);
        return new keyword_analysis_aggregate_1.KeywordAnalysisAggregate(keyword, analysisDate, analytics, relatedKeywords, chartData);
    }
    async getKeywordAnalysis(keywordValue) {
        console.log(`📊 키워드 분석 데이터 조회: ${keywordValue}`);
        try {
            const keyword = new value_objects_1.Keyword(keywordValue);
            const analytics = await this.keywordDataService.findKeywordAnalytics(keyword);
            if (!analytics) {
                return {
                    success: false,
                    data: null,
                };
            }
            const analysisDate = new value_objects_1.AnalysisDate(analytics.analysisDate);
            const aggregate = await this.getExistingAnalysis(keyword, analysisDate);
            return {
                success: true,
                data: aggregate,
            };
        }
        catch (error) {
            console.error('❌ KeywordAnalysisDomainService.getKeywordAnalysis 오류:', error);
            throw error;
        }
    }
    async getAnalyzedKeywords() {
        try {
            return await this.keywordDataService.findAnalyzedKeywords();
        }
        catch (error) {
            console.error('❌ KeywordAnalysisDomainService.getAnalyzedKeywords 오류:', error);
            throw error;
        }
    }
    extractSearchVolume(naverApiData) {
        if (!naverApiData?.datalab?.results?.[0]?.data) {
            console.log('⚠️ 네이버 데이터랩 응답 데이터가 없습니다. 기본값 반환');
            return value_objects_1.SearchVolume.zero();
        }
        const datalabData = naverApiData.datalab.results[0].data;
        if (datalabData.length >= 2) {
            const pcRatio = this.safeParseNumber(datalabData[0]?.ratio, 0);
            const mobileRatio = this.safeParseNumber(datalabData[1]?.ratio, 0);
            console.log(`📊 PC/모바일 분리 데이터: PC=${pcRatio}, Mobile=${mobileRatio}`);
            return new value_objects_1.SearchVolume(pcRatio, mobileRatio);
        }
        if (datalabData.length === 1) {
            const totalRatio = this.safeParseNumber(datalabData[0]?.ratio, 0);
            console.log(`📊 통합 데이터: Total=${totalRatio}`);
            return value_objects_1.SearchVolume.fromTotal(totalRatio, 50);
        }
        console.log('⚠️ 유효한 데이터랩 데이터가 없습니다. 기본값 반환');
        return value_objects_1.SearchVolume.zero();
    }
    safeParseNumber(value, defaultValue = 0) {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        const parsed = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(parsed) || !isFinite(parsed)) {
            console.warn(`⚠️ 유효하지 않은 숫자 값: ${value}, 기본값 ${defaultValue} 사용`);
            return defaultValue;
        }
        return parsed;
    }
    async getExistingAnalysis(keyword, analysisDate) {
        const [analytics, relatedKeywords, chartData] = await Promise.all([
            this.keywordDataService.findKeywordAnalyticsByDate(keyword, analysisDate),
            this.keywordDataService.findRelatedKeywords(keyword, analysisDate),
            this.chartDataService.getChartData(keyword, analysisDate),
        ]);
        if (!analytics) {
            throw new Error(`키워드 '${keyword.value}'의 분석 데이터를 찾을 수 없습니다.`);
        }
        return new keyword_analysis_aggregate_1.KeywordAnalysisAggregate(keyword, analysisDate, analytics, relatedKeywords, chartData);
    }
};
exports.KeywordAnalysisDomainService = KeywordAnalysisDomainService;
exports.KeywordAnalysisDomainService = KeywordAnalysisDomainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [keyword_data_service_1.KeywordDataService,
        chart_data_service_1.ChartDataService])
], KeywordAnalysisDomainService);
//# sourceMappingURL=keyword-analysis-domain.service.js.map