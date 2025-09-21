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
exports.KeywordDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_service_1 = require("../../../../common/services/transaction.service");
const keyword_analytics_entity_1 = require("../../../../database/entities/keyword-analytics.entity");
const related_keywords_entity_1 = require("../../../../database/entities/related-keywords.entity");
let KeywordDataService = class KeywordDataService {
    constructor(keywordAnalyticsRepository, relatedKeywordsRepository, transactionService) {
        this.keywordAnalyticsRepository = keywordAnalyticsRepository;
        this.relatedKeywordsRepository = relatedKeywordsRepository;
        this.transactionService = transactionService;
    }
    async saveKeywordAnalytics(keyword, analysisDate, searchVolume, naverApiData) {
        const analyticsData = {
            keyword: keyword.value,
            monthlySearchPc: searchVolume.pc,
            monthlySearchMobile: searchVolume.mobile,
            monthlySearchTotal: searchVolume.total,
            monthlyContentBlog: naverApiData?.blogSearch?.total || 0,
            monthlyContentCafe: 0,
            monthlyContentAll: naverApiData?.blogSearch?.total || 0,
            estimatedSearchYesterday: 0,
            estimatedSearchEndMonth: 0,
            saturationIndexBlog: 0,
            saturationIndexCafe: 0,
            saturationIndexAll: 0,
            analysisDate: analysisDate.value,
        };
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            await this.transactionService.batchUpsert(queryRunner, keyword_analytics_entity_1.KeywordAnalytics, [analyticsData], ['keyword', 'analysis_date'], [
                'monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total',
                'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
                'estimated_search_yesterday', 'estimated_search_end_month',
                'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
                'updated_at'
            ]);
            return await queryRunner.manager.getRepository(keyword_analytics_entity_1.KeywordAnalytics).findOne({
                where: { keyword: keyword.value, analysisDate: analysisDate.value }
            });
        });
    }
    async saveRelatedKeywords(baseKeyword, analysisDate, relatedKeywordsData) {
        if (!relatedKeywordsData || relatedKeywordsData.length === 0) {
            return [];
        }
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            await this.transactionService.batchDelete(queryRunner, related_keywords_entity_1.RelatedKeywords, { baseKeyword: baseKeyword.value, analysisDate: analysisDate.value });
            const relatedKeywords = relatedKeywordsData.map((item, index) => ({
                baseKeyword: baseKeyword.value,
                relatedKeyword: item.keyword,
                monthlySearchVolume: item.monthlySearchVolume || 0,
                blogCumulativePosts: 0,
                similarityScore: related_keywords_entity_1.SimilarityScore.MEDIUM,
                rankPosition: index + 1,
                analysisDate: analysisDate.value,
            }));
            await this.transactionService.batchInsert(queryRunner, related_keywords_entity_1.RelatedKeywords, relatedKeywords, 500);
            return await queryRunner.manager.getRepository(related_keywords_entity_1.RelatedKeywords).find({
                where: { baseKeyword: baseKeyword.value, analysisDate: analysisDate.value },
                order: { rankPosition: 'ASC' },
            });
        });
    }
    async findKeywordAnalytics(keyword) {
        return await this.keywordAnalyticsRepository.findOne({
            where: { keyword: keyword.value },
            order: { analysisDate: 'DESC' },
        });
    }
    async findKeywordAnalyticsByDate(keyword, analysisDate) {
        return await this.keywordAnalyticsRepository.findOne({
            where: { keyword: keyword.value, analysisDate: analysisDate.value },
        });
    }
    async findRelatedKeywords(keyword, analysisDate) {
        return await this.relatedKeywordsRepository.find({
            where: { baseKeyword: keyword.value, analysisDate: analysisDate.value },
            order: { rankPosition: 'ASC' },
        });
    }
    async findAnalyzedKeywords() {
        return await this.keywordAnalyticsRepository
            .createQueryBuilder('analytics')
            .select(['analytics.keyword', 'MAX(analytics.analysisDate) as latestDate'])
            .groupBy('analytics.keyword')
            .orderBy('latestDate', 'DESC')
            .getRawMany();
    }
};
exports.KeywordDataService = KeywordDataService;
exports.KeywordDataService = KeywordDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_analytics_entity_1.KeywordAnalytics)),
    __param(1, (0, typeorm_1.InjectRepository)(related_keywords_entity_1.RelatedKeywords)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        transaction_service_1.TransactionService])
], KeywordDataService);
//# sourceMappingURL=keyword-data.service.js.map