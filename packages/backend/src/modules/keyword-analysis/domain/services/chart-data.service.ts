import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TransactionService } from '../../../../common/services/transaction.service';
import { SearchTrends, PeriodType } from '../../../../database/entities/search-trends.entity';
import { MonthlySearchRatios } from '../../../../database/entities/monthly-search-ratios.entity';
import { WeekdaySearchRatios } from '../../../../database/entities/weekday-search-ratios.entity';
import { GenderSearchRatios } from '../../../../database/entities/gender-search-ratios.entity';
import { IssueAnalysis } from '../../../../database/entities/issue-analysis.entity';
import { IntentAnalysis } from '../../../../database/entities/intent-analysis.entity';
import { Keyword, AnalysisDate } from '../value-objects';

// 차트 데이터 서비스 - 키워드 분석 차트 데이터의 저장/조회를 담당
@Injectable()
export class ChartDataService {
  constructor(
    @InjectRepository(SearchTrends)
    private searchTrendsRepository: Repository<SearchTrends>,
    @InjectRepository(MonthlySearchRatios)
    private monthlySearchRatiosRepository: Repository<MonthlySearchRatios>,
    @InjectRepository(WeekdaySearchRatios)
    private weekdaySearchRatiosRepository: Repository<WeekdaySearchRatios>,
    @InjectRepository(GenderSearchRatios)
    private genderSearchRatiosRepository: Repository<GenderSearchRatios>,
    @InjectRepository(IssueAnalysis)
    private issueAnalysisRepository: Repository<IssueAnalysis>,
    @InjectRepository(IntentAnalysis)
    private intentAnalysisRepository: Repository<IntentAnalysis>,
    private transactionService: TransactionService,
    private dataSource: DataSource,
  ) {}

  // 차트 데이터 저장
  async saveChartData(
    keyword: Keyword,
    analysisDate: AnalysisDate,
    naverApiData?: any,
  ): Promise<{
    searchTrends: SearchTrends[];
    monthlyRatios: MonthlySearchRatios[];
    weekdayRatios: WeekdaySearchRatios[];
    genderRatios: GenderSearchRatios | null;
    issueAnalysis: IssueAnalysis | null;
    intentAnalysis: IntentAnalysis | null;
  }> {
    return await this.transactionService.runInTransaction(async (queryRunner) => {
      // 기존 차트 데이터 삭제
      await this.clearExistingChartData(keyword, analysisDate, queryRunner);

      const searchTrends = [];
      const monthlyRatios = [];

      // 네이버 데이터랩 데이터 처리
      if (naverApiData?.datalab?.results?.[0]?.data) {
        const datalabData = naverApiData.datalab.results[0].data;
        
        for (const dataPoint of datalabData) {
          // 검색 트렌드 데이터
          searchTrends.push({
            keyword: keyword.value,
            periodType: PeriodType.MONTHLY,
            periodValue: dataPoint.period,
            searchVolume: dataPoint.ratio,
            searchRatio: dataPoint.ratio,
          });

          // 월별 검색 비율 데이터
          const monthMatch = dataPoint.period.match(/-(\d{2})-/);
          if (monthMatch) {
            const monthNumber = parseInt(monthMatch[1]);
            monthlyRatios.push({
              keyword: keyword.value,
              monthNumber,
              searchRatio: dataPoint.ratio,
              analysisYear: analysisDate.year,
            });
          }
        }

        // 배치 삽입
        if (searchTrends.length > 0) {
          await this.transactionService.batchInsert(
            queryRunner,
            SearchTrends,
            searchTrends,
            500
          );
        }

        if (monthlyRatios.length > 0) {
          await this.transactionService.batchInsert(
            queryRunner,
            MonthlySearchRatios,
            monthlyRatios,
            500
          );
        }
      }

      // 저장된 데이터 조회
      const [savedSearchTrends, savedMonthlyRatios] = await Promise.all([
        queryRunner.manager.getRepository(SearchTrends).find({
          where: { keyword: keyword.value, periodType: PeriodType.MONTHLY },
          order: { periodValue: 'ASC' },
        }),
        queryRunner.manager.getRepository(MonthlySearchRatios).find({
          where: { keyword: keyword.value, analysisYear: analysisDate.year },
          order: { monthNumber: 'ASC' },
        }),
      ]);

      return {
        searchTrends: savedSearchTrends,
        monthlyRatios: savedMonthlyRatios,
        weekdayRatios: [],
        genderRatios: null,
        issueAnalysis: null,
        intentAnalysis: null,
      };
    });
  }

  // 차트 데이터 조회
  async getChartData(keyword: Keyword, analysisDate: AnalysisDate): Promise<{
    searchTrends: SearchTrends[];
    monthlyRatios: MonthlySearchRatios[];
    weekdayRatios: WeekdaySearchRatios[];
    genderRatios: GenderSearchRatios | null;
    issueAnalysis: IssueAnalysis | null;
    intentAnalysis: IntentAnalysis | null;
  }> {
    const analysisDateStr = analysisDate.dateString;
    
    const [
      searchTrends,
      monthlyRatios,
      weekdayRatios,
      genderRatios,
      issueAnalysis,
      intentAnalysis,
    ] = await Promise.all([
      this.dataSource
        .getRepository(SearchTrends)
        .createQueryBuilder('st')
        .select(['st.id', 'st.periodValue', 'st.searchVolume', 'st.searchRatio'])
        .where('st.keyword = :keyword AND st.periodType = :periodType')
        .setParameters({ keyword: keyword.value, periodType: PeriodType.MONTHLY })
        .orderBy('st.periodValue', 'ASC')
        .limit(12)
        .getMany(),

      this.dataSource
        .getRepository(MonthlySearchRatios)
        .createQueryBuilder('msr')
        .select(['msr.id', 'msr.monthNumber', 'msr.searchRatio'])
        .where('msr.keyword = :keyword AND msr.analysisYear = :analysisYear')
        .setParameters({ keyword: keyword.value, analysisYear: analysisDate.year })
        .orderBy('msr.monthNumber', 'ASC')
        .getMany(),

      this.dataSource
        .getRepository(WeekdaySearchRatios)
        .createQueryBuilder('wsr')
        .select(['wsr.id', 'wsr.weekdayNumber', 'wsr.searchRatio'])
        .where('wsr.keyword = :keyword AND wsr.analysisDate = :analysisDate')
        .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
        .orderBy('wsr.weekdayNumber', 'ASC')
        .getMany(),

      this.dataSource
        .getRepository(GenderSearchRatios)
        .createQueryBuilder('gsr')
        .select(['gsr.id', 'gsr.maleRatio', 'gsr.femaleRatio'])
        .where('gsr.keyword = :keyword AND gsr.analysisDate = :analysisDate')
        .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
        .getOne(),

      this.dataSource
        .getRepository(IssueAnalysis)
        .createQueryBuilder('ia')
        .select(['ia.id', 'ia.issueType', 'ia.trendDirection', 'ia.issueScore'])
        .where('ia.keyword = :keyword AND ia.analysisDate = :analysisDate')
        .setParameters({ keyword: keyword.value, analysisDate: analysisDateStr })
        .getOne(),

      this.dataSource
        .getRepository(IntentAnalysis)
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
      genderRatios,
      issueAnalysis,
      intentAnalysis,
    };
  }

  // 기존 차트 데이터 삭제
  private async clearExistingChartData(
    keyword: Keyword,
    analysisDate: AnalysisDate,
    queryRunner: any,
  ): Promise<void> {
    await Promise.all([
      this.transactionService.batchDelete(queryRunner, SearchTrends, { keyword: keyword.value }),
      this.transactionService.batchDelete(queryRunner, MonthlySearchRatios, { keyword: keyword.value, analysisYear: analysisDate.year }),
      this.transactionService.batchDelete(queryRunner, WeekdaySearchRatios, { keyword: keyword.value, analysisDate: analysisDate.value }),
      this.transactionService.batchDelete(queryRunner, GenderSearchRatios, { keyword: keyword.value, analysisDate: analysisDate.value }),
      this.transactionService.batchDelete(queryRunner, IssueAnalysis, { keyword: keyword.value, analysisDate: analysisDate.value }),
      this.transactionService.batchDelete(queryRunner, IntentAnalysis, { keyword: keyword.value, analysisDate: analysisDate.value }),
    ]);
  }
}
