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
const keyword_collection_logs_entity_1 = require("../../../../database/entities/keyword-collection-logs.entity");
const keyword_entity_1 = require("../../../../database/entities/keyword.entity");
let KeywordDataService = class KeywordDataService {
    constructor(keywordAnalyticsRepository, relatedKeywordsRepository, keywordCollectionLogsRepository, keywordRepository, transactionService) {
        this.keywordAnalyticsRepository = keywordAnalyticsRepository;
        this.relatedKeywordsRepository = relatedKeywordsRepository;
        this.keywordCollectionLogsRepository = keywordCollectionLogsRepository;
        this.keywordRepository = keywordRepository;
        this.transactionService = transactionService;
    }
    async saveKeywordAnalytics(keyword, analysisDate, naverApiData) {
        const processedData = this.extractNaverApiData(naverApiData);
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            let keywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).findOne({
                where: { keyword: keyword.value }
            });
            if (!keywordEntity) {
                keywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).save({
                    keyword: keyword.value,
                    status: 'active',
                });
            }
            const analyticsData = {
                keywordId: keywordEntity.id,
                keyword: keyword.value,
                monthlySearchPc: processedData.monthlySearchPc,
                monthlySearchMobile: processedData.monthlySearchMobile,
                monthlySearchTotal: processedData.monthlySearchTotal,
                monthlyContentBlog: processedData.monthlyContentBlog,
                monthlyContentCafe: 0,
                monthlyContentAll: processedData.monthlyContentBlog,
                estimatedSearchYesterday: 0,
                estimatedSearchEndMonth: 0,
                saturationIndexBlog: 0,
                saturationIndexCafe: 0,
                saturationIndexAll: 0,
                analysisDate: analysisDate.value,
            };
            await this.transactionService.batchUpsert(queryRunner, keyword_analytics_entity_1.KeywordAnalytics, [analyticsData], ['keyword_id', 'analysis_date'], [
                'keyword', 'monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total',
                'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
                'estimated_search_yesterday', 'estimated_search_end_month',
                'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
                'updated_at'
            ]);
            return await queryRunner.manager.getRepository(keyword_analytics_entity_1.KeywordAnalytics).findOne({
                where: { keywordId: keywordEntity.id, analysisDate: analysisDate.value }
            });
        });
    }
    async saveRelatedKeywords(baseKeyword, analysisDate, relatedKeywordsData) {
        if (!relatedKeywordsData || relatedKeywordsData.length === 0) {
            return [];
        }
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            let baseKeywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).findOne({
                where: { keyword: baseKeyword.value }
            });
            if (!baseKeywordEntity) {
                baseKeywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).save({
                    keyword: baseKeyword.value,
                    status: 'active',
                });
            }
            await this.transactionService.batchDelete(queryRunner, related_keywords_entity_1.RelatedKeywords, { baseKeywordId: baseKeywordEntity.id, analysisDate: analysisDate.value });
            const relatedKeywords = [];
            for (const [index, item] of relatedKeywordsData.entries()) {
                let relatedKeywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).findOne({
                    where: { keyword: item.keyword }
                });
                if (!relatedKeywordEntity) {
                    relatedKeywordEntity = await queryRunner.manager.getRepository(keyword_entity_1.Keyword).save({
                        keyword: item.keyword,
                        status: 'active',
                    });
                }
                relatedKeywords.push({
                    baseKeywordId: baseKeywordEntity.id,
                    relatedKeywordId: relatedKeywordEntity.id,
                    baseKeyword: baseKeyword.value,
                    relatedKeyword: item.keyword,
                    monthlySearchVolume: item.monthlySearchVolume || 0,
                    blogCumulativePosts: 0,
                    similarityScore: related_keywords_entity_1.SimilarityScore.MEDIUM,
                    rankPosition: index + 1,
                    analysisDate: analysisDate.value,
                });
            }
            await this.transactionService.batchUpsert(queryRunner, related_keywords_entity_1.RelatedKeywords, relatedKeywords, ['base_keyword_id', 'related_keyword_id', 'analysis_date'], ['monthly_search_volume', 'blog_cumulative_posts', 'similarity_score', 'rank_position'], 500);
            return await queryRunner.manager.getRepository(related_keywords_entity_1.RelatedKeywords).find({
                where: { baseKeywordId: baseKeywordEntity.id, analysisDate: analysisDate.value },
                order: { rankPosition: 'ASC' },
            });
        });
    }
    async findKeywordAnalytics(keyword) {
        const keywordEntity = await this.keywordRepository.findOne({
            where: { keyword: keyword.value }
        });
        if (!keywordEntity) {
            return null;
        }
        return await this.keywordAnalyticsRepository.findOne({
            where: { keywordId: keywordEntity.id },
            order: { analysisDate: 'DESC' },
        });
    }
    async findKeywordAnalyticsByDate(keyword, analysisDate) {
        const keywordEntity = await this.keywordRepository.findOne({
            where: { keyword: keyword.value }
        });
        if (!keywordEntity) {
            return null;
        }
        return await this.keywordAnalyticsRepository.findOne({
            where: { keywordId: keywordEntity.id, analysisDate: analysisDate.value },
        });
    }
    async findRelatedKeywords(keyword, analysisDate) {
        const keywordEntity = await this.keywordRepository.findOne({
            where: { keyword: keyword.value }
        });
        if (!keywordEntity) {
            return [];
        }
        return await this.relatedKeywordsRepository.find({
            where: { baseKeywordId: keywordEntity.id, analysisDate: analysisDate.value },
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
    extractNaverApiData(naverApiData) {
        let monthlySearchPc = 0;
        let monthlySearchMobile = 0;
        let monthlyContentBlog = 0;
        try {
            if (naverApiData?.results) {
                const result = naverApiData.results.find((r) => r.keyword);
                if (result) {
                    const deviceData = result.deviceData || { pc: 50, mobile: 50 };
                    const totalVolume = result.monthlySearchVolume || 0;
                    monthlySearchPc = Math.round(totalVolume * (deviceData.pc / 100));
                    monthlySearchMobile = Math.round(totalVolume * (deviceData.mobile / 100));
                }
            }
            else if (naverApiData?.datalab?.results?.[0]?.data) {
                const datalabData = naverApiData.datalab.results[0].data;
                if (datalabData.length > 0) {
                    const latestRatio = datalabData[datalabData.length - 1].ratio;
                    monthlySearchPc = Math.round(latestRatio * 50);
                    monthlySearchMobile = Math.round(latestRatio * 50);
                }
            }
            if (naverApiData?.blogSearch?.total) {
                monthlyContentBlog = naverApiData.blogSearch.total;
            }
        }
        catch (error) {
            console.error('❌ 네이버 API 데이터 추출 오류:', error);
        }
        const monthlySearchTotal = monthlySearchPc + monthlySearchMobile;
        return {
            monthlySearchPc,
            monthlySearchMobile,
            monthlySearchTotal,
            monthlyContentBlog,
        };
    }
    async saveScrapedKeywords(keyword, analysisDate, scrapingData) {
        if (!scrapingData?.keywords || scrapingData.keywords.length === 0) {
            console.log('저장할 스크래핑 데이터가 없습니다.');
            return;
        }
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            let baseKeywordEntity = await this.keywordRepository.findOne({
                where: { keyword: keyword.value }
            });
            if (!baseKeywordEntity) {
                baseKeywordEntity = await this.keywordRepository.save({
                    keyword: keyword.value,
                    status: 'active',
                });
            }
            await queryRunner.manager.delete(keyword_collection_logs_entity_1.KeywordCollectionLogs, {
                baseQueryId: baseKeywordEntity.id,
                collectedAt: analysisDate.value,
            });
            const collectionLogs = [];
            for (const scrapedKeyword of scrapingData.keywords) {
                let collectedKeywordEntity = await this.keywordRepository.findOne({
                    where: { keyword: scrapedKeyword.keyword }
                });
                if (!collectedKeywordEntity) {
                    collectedKeywordEntity = await this.keywordRepository.save({
                        keyword: scrapedKeyword.keyword,
                        status: 'active',
                    });
                }
                let collectionType;
                switch (scrapedKeyword.category) {
                    case 'smartblock':
                        collectionType = keyword_collection_logs_entity_1.CollectionType.SMARTBLOCK;
                        break;
                    case 'related_search':
                        collectionType = keyword_collection_logs_entity_1.CollectionType.RELATED_SEARCH;
                        break;
                    case 'trending':
                        collectionType = keyword_collection_logs_entity_1.CollectionType.TRENDING;
                        break;
                    default:
                        continue;
                }
                collectionLogs.push({
                    baseQueryId: baseKeywordEntity.id,
                    collectedKeywordId: collectedKeywordEntity.id,
                    baseQuery: keyword.value,
                    collectedKeyword: scrapedKeyword.keyword,
                    collectionType,
                    rankPosition: scrapedKeyword.rankPosition || 0,
                    collectedAt: new Date(analysisDate.value),
                });
            }
            if (collectionLogs.length > 0) {
                await this.transactionService.batchUpsert(queryRunner, keyword_collection_logs_entity_1.KeywordCollectionLogs, collectionLogs, ['base_query_id', 'collected_keyword_id', 'collection_type', 'collected_at'], ['rank_position']);
            }
            console.log(`✅ 스크래핑 키워드 저장 완료: ${collectionLogs.length}개`);
        });
    }
    async findScrapedKeywords(keyword) {
        const baseKeywordEntity = await this.keywordRepository.findOne({
            where: { keyword: keyword.value }
        });
        if (!baseKeywordEntity) {
            return [];
        }
        const collectionLogs = await this.keywordCollectionLogsRepository.find({
            where: { baseQueryId: baseKeywordEntity.id },
            order: {
                collectionType: 'ASC',
                rankPosition: 'ASC',
                collectedAt: 'DESC'
            },
        });
        return collectionLogs.map(log => ({
            keyword: log.collectedKeyword,
            category: log.collectionType,
            rankPosition: log.rankPosition,
            collectedAt: log.collectedAt,
        }));
    }
};
exports.KeywordDataService = KeywordDataService;
exports.KeywordDataService = KeywordDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_analytics_entity_1.KeywordAnalytics)),
    __param(1, (0, typeorm_1.InjectRepository)(related_keywords_entity_1.RelatedKeywords)),
    __param(2, (0, typeorm_1.InjectRepository)(keyword_collection_logs_entity_1.KeywordCollectionLogs)),
    __param(3, (0, typeorm_1.InjectRepository)(keyword_entity_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        transaction_service_1.TransactionService])
], KeywordDataService);
//# sourceMappingURL=keyword-data.service.js.map