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
exports.KeywordAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyword_analytics_entity_1 = require("../../database/entities/keyword-analytics.entity");
const related_keywords_entity_1 = require("../../database/entities/related-keywords.entity");
const search_trends_entity_1 = require("../../database/entities/search-trends.entity");
const monthly_search_ratios_entity_1 = require("../../database/entities/monthly-search-ratios.entity");
const weekday_search_ratios_entity_1 = require("../../database/entities/weekday-search-ratios.entity");
const gender_search_ratios_entity_1 = require("../../database/entities/gender-search-ratios.entity");
const issue_analysis_entity_1 = require("../../database/entities/issue-analysis.entity");
const intent_analysis_entity_1 = require("../../database/entities/intent-analysis.entity");
let KeywordAnalysisService = class KeywordAnalysisService {
    constructor(keywordAnalyticsRepository, relatedKeywordsRepository, searchTrendsRepository, monthlySearchRatiosRepository, weekdaySearchRatiosRepository, genderSearchRatiosRepository, issueAnalysisRepository, intentAnalysisRepository) {
        this.keywordAnalyticsRepository = keywordAnalyticsRepository;
        this.relatedKeywordsRepository = relatedKeywordsRepository;
        this.searchTrendsRepository = searchTrendsRepository;
        this.monthlySearchRatiosRepository = monthlySearchRatiosRepository;
        this.weekdaySearchRatiosRepository = weekdaySearchRatiosRepository;
        this.genderSearchRatiosRepository = genderSearchRatiosRepository;
        this.issueAnalysisRepository = issueAnalysisRepository;
        this.intentAnalysisRepository = intentAnalysisRepository;
    }
    async analyzeKeyword(keyword, analysisDate, naverApiData, relatedKeywordsData) {
        console.log(`📊 키워드 분석 시작: ${keyword}`);
        try {
            const targetDateString = analysisDate || new Date().toISOString().split('T')[0];
            const targetDate = new Date(targetDateString);
            const existingAnalytics = await this.keywordAnalyticsRepository.findOne({
                where: { keyword, analysisDate: targetDate },
            });
            if (existingAnalytics) {
                console.log(`⚠️ 키워드 '${keyword}'에 대한 분석 데이터가 이미 존재합니다. 기존 데이터를 반환합니다.`);
                const existingData = await this.getKeywordAnalysis(keyword);
                return existingData.data;
            }
            const currentDate = analysisDate ? new Date(analysisDate) : new Date();
            const analyticsData = await this.generateAndSaveKeywordAnalytics(keyword, currentDate, naverApiData);
            const relatedKeywords = relatedKeywordsData && relatedKeywordsData.length > 0
                ? await this.saveRelatedKeywords(keyword, relatedKeywordsData, currentDate)
                : [];
            const chartData = await this.generateAndSaveChartData(keyword, currentDate, naverApiData);
            console.log(`✅ 키워드 분석 완료: ${keyword}`);
            return {
                analytics: analyticsData,
                relatedKeywords: relatedKeywords,
                chartData: chartData,
            };
        }
        catch (error) {
            console.error('❌ KeywordAnalysisService.analyzeKeyword 오류:', error);
            throw error;
        }
    }
    async getKeywordAnalysis(keyword) {
        console.log(`📊 키워드 분석 데이터 조회: ${keyword}`);
        try {
            const analytics = await this.keywordAnalyticsRepository.findOne({
                where: { keyword },
                order: { analysisDate: 'DESC' },
            });
            if (!analytics) {
                return {
                    success: false,
                    data: { analytics: null, relatedKeywords: [], chartData: null },
                };
            }
            const relatedKeywords = await this.relatedKeywordsRepository.find({
                where: { baseKeyword: keyword, analysisDate: analytics.analysisDate },
                order: { rankPosition: 'ASC' },
            });
            const chartData = await this.getAllChartData(keyword, analytics.analysisDate);
            return {
                success: true,
                data: {
                    analytics,
                    relatedKeywords,
                    chartData,
                },
            };
        }
        catch (error) {
            console.error('❌ KeywordAnalysisService.getKeywordAnalysis 오류:', error);
            throw error;
        }
    }
    async getAnalyzedKeywords() {
        try {
            const keywords = await this.keywordAnalyticsRepository
                .createQueryBuilder('analytics')
                .select(['analytics.keyword', 'MAX(analytics.analysisDate) as latestDate'])
                .groupBy('analytics.keyword')
                .orderBy('latestDate', 'DESC')
                .getRawMany();
            return keywords;
        }
        catch (error) {
            console.error('❌ KeywordAnalysisService.getAnalyzedKeywords 오류:', error);
            throw error;
        }
    }
    async generateAndSaveKeywordAnalytics(keyword, analysisDate, naverApiData) {
        const analyticsData = {
            keyword,
            monthlySearchPc: naverApiData?.datalab?.results?.[0]?.data?.[0]?.ratio || 0,
            monthlySearchMobile: naverApiData?.datalab?.results?.[0]?.data?.[1]?.ratio || 0,
            monthlySearchTotal: naverApiData?.datalab?.results?.[0]?.data?.reduce((sum, item) => sum + item.ratio, 0) || 0,
            monthlyContentBlog: naverApiData?.blogSearch?.total || 0,
            monthlyContentCafe: 0,
            monthlyContentAll: naverApiData?.blogSearch?.total || 0,
            estimatedSearchYesterday: 0,
            estimatedSearchEndMonth: 0,
            saturationIndexBlog: 0,
            saturationIndexCafe: 0,
            saturationIndexAll: 0,
            analysisDate,
        };
        try {
            const result = await this.keywordAnalyticsRepository
                .createQueryBuilder()
                .insert()
                .into(keyword_analytics_entity_1.KeywordAnalytics)
                .values(analyticsData)
                .orUpdate(['monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total',
                'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
                'estimated_search_yesterday', 'estimated_search_end_month',
                'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
                'updated_at'], ['keyword', 'analysis_date'])
                .execute();
            return await this.keywordAnalyticsRepository.findOne({
                where: { keyword, analysisDate }
            });
        }
        catch (error) {
            console.error('❌ generateAndSaveKeywordAnalytics 오류:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`⚠️ 중복 키 에러 발생, 기존 데이터 조회: ${keyword}`);
                return await this.keywordAnalyticsRepository.findOne({
                    where: { keyword, analysisDate }
                });
            }
            throw error;
        }
    }
    async saveRelatedKeywords(keyword, relatedKeywordsData, analysisDate) {
        try {
            await this.relatedKeywordsRepository.delete({
                baseKeyword: keyword,
                analysisDate,
            });
            const relatedKeywords = relatedKeywordsData.map((item, index) => ({
                baseKeyword: keyword,
                relatedKeyword: item.keyword,
                monthlySearchVolume: item.monthlySearchVolume || 0,
                blogCumulativePosts: 0,
                similarityScore: related_keywords_entity_1.SimilarityScore.MEDIUM,
                rankPosition: index + 1,
                analysisDate,
            }));
            return await this.relatedKeywordsRepository.save(relatedKeywords);
        }
        catch (error) {
            console.error('❌ saveRelatedKeywords 오류:', error);
            throw error;
        }
    }
    async generateAndSaveChartData(keyword, analysisDate, naverApiData) {
        const currentYear = new Date().getFullYear();
        try {
            await Promise.all([
                this.searchTrendsRepository.delete({ keyword }),
                this.monthlySearchRatiosRepository.delete({ keyword, analysisYear: currentYear }),
                this.weekdaySearchRatiosRepository.delete({ keyword, analysisDate }),
                this.genderSearchRatiosRepository.delete({ keyword, analysisDate }),
                this.issueAnalysisRepository.delete({ keyword, analysisDate }),
                this.intentAnalysisRepository.delete({ keyword, analysisDate }),
            ]);
            const searchTrends = [];
            if (naverApiData?.datalab?.results?.[0]?.data) {
                const datalabData = naverApiData.datalab.results[0].data;
                for (const dataPoint of datalabData) {
                    const trend = this.searchTrendsRepository.create({
                        keyword,
                        periodType: search_trends_entity_1.PeriodType.MONTHLY,
                        periodValue: dataPoint.period,
                        searchVolume: dataPoint.ratio,
                        searchRatio: dataPoint.ratio,
                    });
                    searchTrends.push(trend);
                }
                await this.searchTrendsRepository.save(searchTrends);
            }
            const monthlyRatios = [];
            if (naverApiData?.datalab?.results?.[0]?.data) {
                const datalabData = naverApiData.datalab.results[0].data;
                datalabData.forEach((dataPoint, index) => {
                    const monthMatch = dataPoint.period.match(/-(\d{2})-/);
                    const monthNumber = monthMatch ? parseInt(monthMatch[1]) : index + 1;
                    const ratio = this.monthlySearchRatiosRepository.create({
                        keyword,
                        monthNumber,
                        searchRatio: dataPoint.ratio,
                        analysisYear: currentYear,
                    });
                    monthlyRatios.push(ratio);
                });
                await this.monthlySearchRatiosRepository.save(monthlyRatios);
            }
            const weekdayRatios = [];
            let genderRatio = null;
            let issueAnalysis = null;
            let intentAnalysis = null;
            return {
                searchTrends,
                monthlyRatios,
                weekdayRatios,
                genderRatios: genderRatio,
                issueAnalysis,
                intentAnalysis,
            };
        }
        catch (error) {
            console.error('❌ generateAndSaveChartData 오류:', error);
            throw error;
        }
    }
    async getAllChartData(keyword, analysisDate) {
        const [searchTrends, monthlyRatios, weekdayRatios, genderRatios, issueAnalysis, intentAnalysis,] = await Promise.all([
            this.searchTrendsRepository.find({
                where: { keyword, periodType: search_trends_entity_1.PeriodType.MONTHLY },
                order: { periodValue: 'ASC' },
                take: 12,
            }),
            this.monthlySearchRatiosRepository.find({
                where: { keyword },
                order: { monthNumber: 'ASC' },
            }),
            this.weekdaySearchRatiosRepository.find({
                where: { keyword, analysisDate },
                order: { weekdayNumber: 'ASC' },
            }),
            this.genderSearchRatiosRepository.findOne({
                where: { keyword, analysisDate },
            }),
            this.issueAnalysisRepository.findOne({
                where: { keyword, analysisDate },
            }),
            this.intentAnalysisRepository.findOne({
                where: { keyword, analysisDate },
            }),
        ]);
        return {
            searchTrends,
            monthlyRatios,
            weekdayRatios,
            genderRatios,
            issueAnalysis,
            intentAnalysis,
        };
    }
};
exports.KeywordAnalysisService = KeywordAnalysisService;
exports.KeywordAnalysisService = KeywordAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_analytics_entity_1.KeywordAnalytics)),
    __param(1, (0, typeorm_1.InjectRepository)(related_keywords_entity_1.RelatedKeywords)),
    __param(2, (0, typeorm_1.InjectRepository)(search_trends_entity_1.SearchTrends)),
    __param(3, (0, typeorm_1.InjectRepository)(monthly_search_ratios_entity_1.MonthlySearchRatios)),
    __param(4, (0, typeorm_1.InjectRepository)(weekday_search_ratios_entity_1.WeekdaySearchRatios)),
    __param(5, (0, typeorm_1.InjectRepository)(gender_search_ratios_entity_1.GenderSearchRatios)),
    __param(6, (0, typeorm_1.InjectRepository)(issue_analysis_entity_1.IssueAnalysis)),
    __param(7, (0, typeorm_1.InjectRepository)(intent_analysis_entity_1.IntentAnalysis)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], KeywordAnalysisService);
//# sourceMappingURL=keyword-analysis.service.js.map