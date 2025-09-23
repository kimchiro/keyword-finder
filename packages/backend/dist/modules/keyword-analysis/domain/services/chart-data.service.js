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
exports.ChartDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_service_1 = require("../../../../common/services/transaction.service");
const search_trends_entity_1 = require("../../../../database/entities/search-trends.entity");
const monthly_search_ratios_entity_1 = require("../../../../database/entities/monthly-search-ratios.entity");
const weekday_search_ratios_entity_1 = require("../../../../database/entities/weekday-search-ratios.entity");
const issue_analysis_entity_1 = require("../../../../database/entities/issue-analysis.entity");
const intent_analysis_entity_1 = require("../../../../database/entities/intent-analysis.entity");
let ChartDataService = class ChartDataService {
    constructor(searchTrendsRepository, monthlySearchRatiosRepository, weekdaySearchRatiosRepository, issueAnalysisRepository, intentAnalysisRepository, transactionService, dataSource) {
        this.searchTrendsRepository = searchTrendsRepository;
        this.monthlySearchRatiosRepository = monthlySearchRatiosRepository;
        this.weekdaySearchRatiosRepository = weekdaySearchRatiosRepository;
        this.issueAnalysisRepository = issueAnalysisRepository;
        this.intentAnalysisRepository = intentAnalysisRepository;
        this.transactionService = transactionService;
        this.dataSource = dataSource;
    }
    async saveChartData(keyword, analysisDate, naverApiData) {
        return await this.transactionService.runInTransaction(async (queryRunner) => {
            const KeywordEntity = await Promise.resolve().then(() => require('../../../../database/entities/keyword.entity')).then(m => m.Keyword);
            let keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).findOne({
                where: { keyword: keyword.value }
            });
            if (!keywordEntity) {
                keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).save({
                    keyword: keyword.value,
                    status: 'active',
                });
            }
            await this.clearExistingChartData(keyword, analysisDate, queryRunner);
            const chartDataToSave = this.extractChartDataFromNaverApi(keyword.value, analysisDate, naverApiData, keywordEntity.id);
            if (chartDataToSave.searchTrends.length > 0) {
                await this.transactionService.batchUpsert(queryRunner, search_trends_entity_1.SearchTrends, chartDataToSave.searchTrends, ['keyword_id', 'keyword', 'period_type', 'period_value'], ['search_volume', 'search_ratio'], 500);
            }
            if (chartDataToSave.monthlyRatios.length > 0) {
                await this.transactionService.batchUpsert(queryRunner, monthly_search_ratios_entity_1.MonthlySearchRatios, chartDataToSave.monthlyRatios, ['keyword_id', 'keyword', 'month_number', 'analysis_year'], ['search_ratio'], 500);
            }
            const [savedSearchTrends, savedMonthlyRatios] = await Promise.all([
                queryRunner.manager.getRepository(search_trends_entity_1.SearchTrends).find({
                    where: { keywordId: keywordEntity.id, keyword: keyword.value, periodType: search_trends_entity_1.PeriodType.MONTHLY },
                    order: { periodValue: 'ASC' },
                }),
                queryRunner.manager.getRepository(monthly_search_ratios_entity_1.MonthlySearchRatios).find({
                    where: { keywordId: keywordEntity.id, keyword: keyword.value, analysisYear: analysisDate.year },
                    order: { monthNumber: 'ASC' },
                }),
            ]);
            return {
                searchTrends: savedSearchTrends,
                monthlyRatios: savedMonthlyRatios,
                weekdayRatios: [],
                issueAnalysis: null,
                intentAnalysis: null,
            };
        });
    }
    async getChartData(keyword, analysisDate) {
        const KeywordEntity = await Promise.resolve().then(() => require('../../../../database/entities/keyword.entity')).then(m => m.Keyword);
        const keywordEntity = await this.dataSource.getRepository(KeywordEntity).findOne({
            where: { keyword: keyword.value }
        });
        if (!keywordEntity) {
            return {
                searchTrends: [],
                monthlyRatios: [],
                weekdayRatios: [],
                issueAnalysis: null,
                intentAnalysis: null,
            };
        }
        const analysisDateStr = analysisDate.dateString;
        const [searchTrends, monthlyRatios, weekdayRatios, issueAnalysis, intentAnalysis,] = await Promise.all([
            this.dataSource
                .getRepository(search_trends_entity_1.SearchTrends)
                .createQueryBuilder('st')
                .select(['st.id', 'st.keywordId', 'st.keyword', 'st.periodType', 'st.periodValue', 'st.searchVolume', 'st.searchRatio', 'st.createdAt'])
                .where('st.keywordId = :keywordId AND st.keyword = :keyword AND st.periodType = :periodType')
                .setParameters({ keywordId: keywordEntity.id, keyword: keyword.value, periodType: search_trends_entity_1.PeriodType.MONTHLY })
                .orderBy('st.periodValue', 'ASC')
                .limit(12)
                .getMany(),
            this.dataSource
                .getRepository(monthly_search_ratios_entity_1.MonthlySearchRatios)
                .createQueryBuilder('msr')
                .select(['msr.id', 'msr.keywordId', 'msr.keyword', 'msr.monthNumber', 'msr.searchRatio', 'msr.analysisYear', 'msr.createdAt'])
                .where('msr.keywordId = :keywordId AND msr.keyword = :keyword AND msr.analysisYear = :analysisYear')
                .setParameters({ keywordId: keywordEntity.id, keyword: keyword.value, analysisYear: analysisDate.year })
                .orderBy('msr.monthNumber', 'ASC')
                .getMany(),
            this.dataSource
                .getRepository(weekday_search_ratios_entity_1.WeekdaySearchRatios)
                .createQueryBuilder('wsr')
                .select(['wsr.id', 'wsr.weekdayNumber', 'wsr.searchRatio'])
                .where('wsr.keyword = :keyword AND wsr.analysisDate = :analysisDate')
                .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
                .orderBy('wsr.weekdayNumber', 'ASC')
                .getMany(),
            this.dataSource
                .getRepository(issue_analysis_entity_1.IssueAnalysis)
                .createQueryBuilder('ia')
                .select(['ia.id', 'ia.issueType', 'ia.trendDirection', 'ia.issueScore'])
                .where('ia.keyword = :keyword AND ia.analysisDate = :analysisDate')
                .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
                .getOne(),
            this.dataSource
                .getRepository(intent_analysis_entity_1.IntentAnalysis)
                .createQueryBuilder('inta')
                .select(['inta.id', 'inta.primaryIntent', 'inta.informationalScore', 'inta.transactionalScore', 'inta.navigationalScore'])
                .where('inta.keyword = :keyword AND inta.analysisDate = :analysisDate')
                .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
                .getOne(),
        ]);
        return {
            searchTrends,
            monthlyRatios,
            weekdayRatios,
            issueAnalysis,
            intentAnalysis,
        };
    }
    async clearExistingChartData(keyword, analysisDate, queryRunner) {
        await Promise.all([
            this.transactionService.batchDelete(queryRunner, search_trends_entity_1.SearchTrends, { keyword: keyword.value }),
            this.transactionService.batchDelete(queryRunner, monthly_search_ratios_entity_1.MonthlySearchRatios, { keyword: keyword.value, analysisYear: analysisDate.year }),
            this.transactionService.batchDelete(queryRunner, weekday_search_ratios_entity_1.WeekdaySearchRatios, { keyword: keyword.value, analysisDate: analysisDate.value }),
            this.transactionService.batchDelete(queryRunner, issue_analysis_entity_1.IssueAnalysis, { keyword: keyword.value, analysisDate: analysisDate.value }),
            this.transactionService.batchDelete(queryRunner, intent_analysis_entity_1.IntentAnalysis, { keyword: keyword.value, analysisDate: analysisDate.value }),
        ]);
    }
    extractChartDataFromNaverApi(keyword, analysisDate, naverApiData, keywordId) {
        const searchTrends = [];
        const monthlyRatios = [];
        try {
            if (naverApiData?.datalab?.results?.[0]?.data) {
                const datalabData = naverApiData.datalab.results[0].data;
                for (const dataPoint of datalabData) {
                    searchTrends.push({
                        keywordId,
                        keyword,
                        periodType: search_trends_entity_1.PeriodType.MONTHLY,
                        periodValue: dataPoint.period,
                        searchVolume: dataPoint.ratio,
                        searchRatio: dataPoint.ratio,
                    });
                    const monthMatch = dataPoint.period.match(/-(\d{2})-/);
                    if (monthMatch) {
                        const monthNumber = parseInt(monthMatch[1]);
                        monthlyRatios.push({
                            keywordId,
                            keyword,
                            monthNumber,
                            searchRatio: dataPoint.ratio,
                            analysisYear: analysisDate.year,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error('❌ 네이버 API 차트 데이터 추출 오류:', error);
        }
        return {
            searchTrends,
            monthlyRatios,
        };
    }
};
exports.ChartDataService = ChartDataService;
exports.ChartDataService = ChartDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(search_trends_entity_1.SearchTrends)),
    __param(1, (0, typeorm_1.InjectRepository)(monthly_search_ratios_entity_1.MonthlySearchRatios)),
    __param(2, (0, typeorm_1.InjectRepository)(weekday_search_ratios_entity_1.WeekdaySearchRatios)),
    __param(3, (0, typeorm_1.InjectRepository)(issue_analysis_entity_1.IssueAnalysis)),
    __param(4, (0, typeorm_1.InjectRepository)(intent_analysis_entity_1.IntentAnalysis)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        transaction_service_1.TransactionService,
        typeorm_2.DataSource])
], ChartDataService);
//# sourceMappingURL=chart-data.service.js.map