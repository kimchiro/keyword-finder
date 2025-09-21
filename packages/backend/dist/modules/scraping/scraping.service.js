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
exports.ScrapingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyword_collection_logs_entity_1 = require("../../database/entities/keyword-collection-logs.entity");
const browser_pool_service_1 = require("../../common/services/browser-pool.service");
const app_config_1 = require("../../config/app.config");
const scraping_constants_1 = require("../../constants/scraping.constants");
let ScrapingService = class ScrapingService {
    constructor(keywordCollectionLogsRepository, browserPoolService, appConfig) {
        this.keywordCollectionLogsRepository = keywordCollectionLogsRepository;
        this.browserPoolService = browserPoolService;
        this.appConfig = appConfig;
    }
    async scrapeKeywords(scrapeDto) {
        const startTime = Date.now();
        console.log(`🕷️ 키워드 스크래핑 시작: ${scrapeDto.query}`);
        try {
            const { query, types = ['related_search'], maxResults = this.appConfig.scrapingMaxResults } = scrapeDto;
            const scrapedKeywords = await this.performRealScraping(query, types, maxResults);
            await this.saveCollectionLogs(query, scrapedKeywords);
            const executionTime = (Date.now() - startTime) / 1000;
            const categories = scrapedKeywords.reduce((acc, keyword) => {
                acc[keyword.category] = (acc[keyword.category] || 0) + 1;
                return acc;
            }, {});
            console.log(`✅ 키워드 스크래핑 완료: ${scrapedKeywords.length}개, ${executionTime}초`);
            return {
                query,
                totalKeywords: scrapedKeywords.length,
                executionTime,
                categories,
                keywords: scrapedKeywords,
            };
        }
        catch (error) {
            console.error('❌ ScrapingService.scrapeKeywords 오류:', error);
            throw error;
        }
    }
    async getCollectionLogs(query, page = 1, limit = 20) {
        try {
            const queryBuilder = this.keywordCollectionLogsRepository
                .createQueryBuilder('log')
                .orderBy('log.collectedAt', 'DESC');
            if (query) {
                queryBuilder.where('log.baseQuery LIKE :query OR log.collectedKeyword LIKE :query', {
                    query: `%${query}%`,
                });
            }
            const [logs, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                logs,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            console.error('❌ ScrapingService.getCollectionLogs 오류:', error);
            throw error;
        }
    }
    async getScrapingStats(days = 7) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const stats = await this.keywordCollectionLogsRepository
                .createQueryBuilder('log')
                .select([
                'DATE(log.collectedAt) as date',
                'log.collectionType as type',
                'COUNT(*) as count',
            ])
                .where('log.collectedAt >= :startDate', { startDate })
                .groupBy('DATE(log.collectedAt), log.collectionType')
                .orderBy('date', 'DESC')
                .getRawMany();
            const dailyStats = stats.reduce((acc, stat) => {
                const date = stat.date;
                if (!acc[date]) {
                    acc[date] = { date, total: 0, types: {} };
                }
                acc[date].types[stat.type] = parseInt(stat.count);
                acc[date].total += parseInt(stat.count);
                return acc;
            }, {});
            const typeStats = stats.reduce((acc, stat) => {
                acc[stat.type] = (acc[stat.type] || 0) + parseInt(stat.count);
                return acc;
            }, {});
            return {
                period: `최근 ${days}일`,
                dailyStats: Object.values(dailyStats),
                typeStats,
                totalKeywords: Object.values(typeStats).reduce((sum, count) => sum + count, 0),
            };
        }
        catch (error) {
            console.error('❌ ScrapingService.getScrapingStats 오류:', error);
            throw error;
        }
    }
    async performRealScraping(query, types, maxResults) {
        const { NaverScraper } = await Promise.resolve().then(() => require('./scraper/naver-scraper'));
        const scraper = new NaverScraper(this.browserPoolService);
        try {
            await scraper.initialize();
            const scrapedKeywords = await scraper.scrapeAllKeywords(query, types);
            const limitedKeywords = scrapedKeywords.slice(0, maxResults);
            const formattedKeywords = limitedKeywords.map((keyword, index) => ({
                keyword: keyword.keyword,
                category: keyword.category,
                rank: index + 1,
                source: keyword.source,
                searchVolume: keyword.searchVolume || Math.floor(Math.random() * scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MAX) + scraping_constants_1.SEARCH_VOLUME.DEFAULT_RANGE.MIN,
                competition: keyword.competition || 'medium',
                similarity: keyword.similarity || 'medium',
            }));
            return formattedKeywords;
        }
        finally {
            await scraper.close();
        }
    }
    async getBrowserPoolStatus() {
        return this.browserPoolService.getPoolStatus();
    }
    async saveCollectionLogs(baseQuery, keywords) {
        try {
            const logs = keywords.map(keyword => {
                return this.keywordCollectionLogsRepository.create({
                    baseQuery,
                    collectedKeyword: keyword.keyword,
                    collectionType: keyword.category,
                    sourcePage: keyword.source,
                    rankPosition: keyword.rank,
                });
            });
            await this.keywordCollectionLogsRepository.save(logs);
            console.log(`📝 수집 로그 저장 완료: ${logs.length}개`);
        }
        catch (error) {
            console.error('❌ 수집 로그 저장 실패:', error);
        }
    }
};
exports.ScrapingService = ScrapingService;
exports.ScrapingService = ScrapingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_collection_logs_entity_1.KeywordCollectionLogs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        browser_pool_service_1.BrowserPoolService,
        app_config_1.AppConfigService])
], ScrapingService);
//# sourceMappingURL=scraping.service.js.map