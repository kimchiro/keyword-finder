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
    async analyzeKeyword(keyword, analysisDate) {
        console.log(`📊 키워드 분석 시작: ${keyword}`);
        try {
            const targetDateString = analysisDate || new Date().toISOString().split('T')[0];
            const targetDate = new Date(targetDateString);
            const existingAnalytics = await this.keywordAnalyticsRepository.findOne({
                where: { keyword, analysisDate: targetDate },
            });
            if (existingAnalytics) {
                console.log(`⚠️ 키워드 '${keyword}'에 대한 분석 데이터가 이미 존재합니다. 기존 데이터를 반환합니다.`);
                return this.getKeywordAnalysis(keyword);
            }
            const currentDate = analysisDate ? new Date(analysisDate) : new Date();
            const analyticsData = await this.generateAndSaveKeywordAnalytics(keyword, currentDate);
            const relatedKeywordsData = await this.generateAndSaveRelatedKeywords(keyword, currentDate);
            const chartData = await this.generateAndSaveChartData(keyword, currentDate);
            console.log(`✅ 키워드 분석 완료: ${keyword}`);
            return {
                success: true,
                data: {
                    analytics: analyticsData,
                    relatedKeywords: relatedKeywordsData,
                    chartData: chartData,
                },
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
    async generateAndSaveKeywordAnalytics(keyword, analysisDate) {
        const baseSearchVolume = Math.floor(Math.random() * 100000) + 10000;
        const analyticsData = this.keywordAnalyticsRepository.create({
            keyword,
            monthlySearchPc: Math.floor(baseSearchVolume * 0.4),
            monthlySearchMobile: Math.floor(baseSearchVolume * 0.6),
            monthlySearchTotal: baseSearchVolume,
            monthlyContentBlog: Math.floor(Math.random() * 5000) + 500,
            monthlyContentCafe: Math.floor(Math.random() * 1000) + 100,
            monthlyContentAll: Math.floor(Math.random() * 6000) + 600,
            estimatedSearchYesterday: Math.floor(baseSearchVolume * 0.8),
            estimatedSearchEndMonth: Math.floor(baseSearchVolume * 1.2),
            saturationIndexBlog: Math.floor(Math.random() * 100),
            saturationIndexCafe: Math.floor(Math.random() * 100),
            saturationIndexAll: Math.floor(Math.random() * 100),
            analysisDate,
        });
        return await this.keywordAnalyticsRepository.save(analyticsData);
    }
    async generateAndSaveRelatedKeywords(keyword, analysisDate) {
        const relatedKeywords = [];
        const similarityOptions = [related_keywords_entity_1.SimilarityScore.LOW, related_keywords_entity_1.SimilarityScore.MEDIUM, related_keywords_entity_1.SimilarityScore.HIGH];
        for (let i = 0; i < 10; i++) {
            const relatedKeyword = this.relatedKeywordsRepository.create({
                baseKeyword: keyword,
                relatedKeyword: `${keyword} 연관키워드${i + 1}`,
                monthlySearchVolume: Math.floor(Math.random() * 50000) + 1000,
                blogCumulativePosts: Math.floor(Math.random() * 10000) + 100,
                similarityScore: similarityOptions[Math.floor(Math.random() * similarityOptions.length)],
                rankPosition: i + 1,
                analysisDate,
            });
            relatedKeywords.push(relatedKeyword);
        }
        return await this.relatedKeywordsRepository.save(relatedKeywords);
    }
    async generateAndSaveChartData(keyword, analysisDate) {
        const currentYear = new Date().getFullYear();
        const searchTrends = [];
        for (let i = 1; i <= 12; i++) {
            const trend = this.searchTrendsRepository.create({
                keyword,
                periodType: search_trends_entity_1.PeriodType.MONTHLY,
                periodValue: `${currentYear}-${String(i).padStart(2, '0')}`,
                searchVolume: Math.floor(Math.random() * 100000) + 10000,
                searchRatio: Math.floor(Math.random() * 100),
            });
            searchTrends.push(trend);
        }
        await this.searchTrendsRepository.save(searchTrends);
        const monthlyRatios = [];
        for (let i = 1; i <= 12; i++) {
            const ratio = this.monthlySearchRatiosRepository.create({
                keyword,
                monthNumber: i,
                searchRatio: Math.floor(Math.random() * 20) + 5,
                analysisYear: currentYear,
            });
            monthlyRatios.push(ratio);
        }
        await this.monthlySearchRatiosRepository.save(monthlyRatios);
        const weekdayRatios = [];
        for (let i = 1; i <= 7; i++) {
            const ratio = this.weekdaySearchRatiosRepository.create({
                keyword,
                weekdayNumber: i,
                searchRatio: Math.floor(Math.random() * 20) + 10,
                analysisDate,
            });
            weekdayRatios.push(ratio);
        }
        await this.weekdaySearchRatiosRepository.save(weekdayRatios);
        const genderRatio = this.genderSearchRatiosRepository.create({
            keyword,
            maleRatio: Math.floor(Math.random() * 40) + 30,
            femaleRatio: Math.floor(Math.random() * 40) + 30,
            analysisDate,
        });
        await this.genderSearchRatiosRepository.save(genderRatio);
        const issueTypes = [issue_analysis_entity_1.IssueType.RISING, issue_analysis_entity_1.IssueType.STABLE, issue_analysis_entity_1.IssueType.FALLING, issue_analysis_entity_1.IssueType.NEW];
        const trendDirections = [issue_analysis_entity_1.TrendDirection.UP, issue_analysis_entity_1.TrendDirection.DOWN, issue_analysis_entity_1.TrendDirection.MAINTAIN];
        const issueAnalysis = this.issueAnalysisRepository.create({
            keyword,
            issueType: issueTypes[Math.floor(Math.random() * issueTypes.length)],
            issueScore: Math.floor(Math.random() * 100),
            trendDirection: trendDirections[Math.floor(Math.random() * trendDirections.length)],
            volatilityScore: Math.floor(Math.random() * 100),
            analysisDate,
        });
        await this.issueAnalysisRepository.save(issueAnalysis);
        const primaryIntents = [intent_analysis_entity_1.PrimaryIntent.INFORMATIONAL, intent_analysis_entity_1.PrimaryIntent.COMMERCIAL, intent_analysis_entity_1.PrimaryIntent.MIXED];
        const intentAnalysis = this.intentAnalysisRepository.create({
            keyword,
            informationalRatio: Math.floor(Math.random() * 60) + 20,
            commercialRatio: Math.floor(Math.random() * 60) + 20,
            primaryIntent: primaryIntents[Math.floor(Math.random() * primaryIntents.length)],
            confidenceScore: Math.floor(Math.random() * 40) + 60,
            analysisDate,
        });
        await this.intentAnalysisRepository.save(intentAnalysis);
        return {
            searchTrends,
            monthlyRatios,
            weekdayRatios,
            genderRatios: genderRatio,
            issueAnalysis,
            intentAnalysis,
        };
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