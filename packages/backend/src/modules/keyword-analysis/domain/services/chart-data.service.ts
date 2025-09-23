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

  // 차트 데이터 저장 - 네이버 API 결과 직접 저장 (단순화)
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
      // 키워드 엔티티 조회 또는 생성
      const KeywordEntity = await import('../../../../database/entities/keyword.entity').then(m => m.Keyword);
      let keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).findOne({
        where: { keyword: keyword.value }
      });

      if (!keywordEntity) {
        keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).save({
          keyword: keyword.value,
          status: 'active',
        });
      }

      // 기존 차트 데이터 삭제
      await this.clearExistingChartData(keyword, analysisDate, queryRunner);

      // 네이버 API 데이터를 직접 변환하여 저장 (keywordId 포함)
      const chartDataToSave = this.extractChartDataFromNaverApi(keyword.value, analysisDate, naverApiData, keywordEntity.id);

      // 배치 UPSERT (중복 키 처리)
      if (chartDataToSave.searchTrends.length > 0) {
        await this.transactionService.batchUpsert(
          queryRunner,
          SearchTrends,
          chartDataToSave.searchTrends,
          ['keyword_id', 'keyword', 'period_type', 'period_value'], // 중복 감지 컬럼 (DB 컬럼명)
          ['search_volume', 'search_ratio'], // 업데이트할 컬럼 (DB 컬럼명)
          500
        );
      }

      if (chartDataToSave.monthlyRatios.length > 0) {
        await this.transactionService.batchUpsert(
          queryRunner,
          MonthlySearchRatios,
          chartDataToSave.monthlyRatios,
          ['keyword_id', 'keyword', 'month_number', 'analysis_year'], // 중복 감지 컬럼 (DB 컬럼명)
          ['search_ratio'], // 업데이트할 컬럼 (DB 컬럼명)
          500
        );
      }

      // 🆕 성별 비율 데이터 저장
      if (chartDataToSave.genderRatios) {
        await this.transactionService.batchUpsert(
          queryRunner,
          GenderSearchRatios,
          [chartDataToSave.genderRatios],
          ['keyword_id', 'analysis_date'], // 중복 감지 컬럼 (DB 컬럼명)
          ['male_ratio', 'female_ratio'], // 업데이트할 컬럼 (DB 컬럼명)
          1
        );
        console.log(`✅ 성별 비율 데이터 저장 완료: ${keyword.value}`);
      }

      // 저장된 데이터 조회
      const [savedSearchTrends, savedMonthlyRatios, savedGenderRatios] = await Promise.all([
        queryRunner.manager.getRepository(SearchTrends).find({
          where: { keywordId: keywordEntity.id, keyword: keyword.value, periodType: PeriodType.MONTHLY },
          order: { periodValue: 'ASC' },
        }),
        queryRunner.manager.getRepository(MonthlySearchRatios).find({
          where: { keywordId: keywordEntity.id, keyword: keyword.value, analysisYear: analysisDate.year },
          order: { monthNumber: 'ASC' },
        }),
        queryRunner.manager.getRepository(GenderSearchRatios).findOne({
          where: { keywordId: keywordEntity.id, analysisDate: analysisDate.value },
        }),
      ]);

      return {
        searchTrends: savedSearchTrends,
        monthlyRatios: savedMonthlyRatios,
        weekdayRatios: [],
        genderRatios: savedGenderRatios,
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
    // 키워드 엔티티 조회
    const KeywordEntity = await import('../../../../database/entities/keyword.entity').then(m => m.Keyword);
    const keywordEntity = await this.dataSource.getRepository(KeywordEntity).findOne({
      where: { keyword: keyword.value }
    });

    if (!keywordEntity) {
      // 키워드가 없으면 빈 데이터 반환
      return {
        searchTrends: [],
        monthlyRatios: [],
        weekdayRatios: [],
        genderRatios: null,
        issueAnalysis: null,
        intentAnalysis: null,
      };
    }

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
        .select(['st.id', 'st.keywordId', 'st.keyword', 'st.periodType', 'st.periodValue', 'st.searchVolume', 'st.searchRatio', 'st.createdAt'])
        .where('st.keywordId = :keywordId AND st.keyword = :keyword AND st.periodType = :periodType')
        .setParameters({ keywordId: keywordEntity.id, keyword: keyword.value, periodType: PeriodType.MONTHLY })
        .orderBy('st.periodValue', 'ASC')
        .limit(12)
        .getMany(),

      this.dataSource
        .getRepository(MonthlySearchRatios)
        .createQueryBuilder('msr')
        .select(['msr.id', 'msr.keywordId', 'msr.keyword', 'msr.monthNumber', 'msr.searchRatio', 'msr.analysisYear', 'msr.createdAt'])
        .where('msr.keywordId = :keywordId AND msr.keyword = :keyword AND msr.analysisYear = :analysisYear')
        .setParameters({ keywordId: keywordEntity.id, keyword: keyword.value, analysisYear: analysisDate.year })
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

  // 네이버 API 데이터에서 차트 데이터 추출
  private extractChartDataFromNaverApi(
    keyword: string,
    analysisDate: AnalysisDate,
    naverApiData?: any,
    keywordId?: number,
  ): {
    searchTrends: any[];
    monthlyRatios: any[];
    genderRatios: any | null;
  } {
    const searchTrends: any[] = [];
    const monthlyRatios: any[] = [];
    let genderRatios: any | null = null;

    try {
      // 네이버 데이터랩 데이터 처리
      if (naverApiData?.datalab?.results?.[0]?.data) {
        const datalabData = naverApiData.datalab.results[0].data;
        
        for (const dataPoint of datalabData) {
          // 검색 트렌드 데이터 - 네이버 API 결과 직접 사용
          searchTrends.push({
            keywordId, // keywordId 추가
            keyword,
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
              keywordId, // keywordId 추가
              keyword,
              monthNumber,
              searchRatio: dataPoint.ratio,
              analysisYear: analysisDate.year,
            });
          }
        }
      }

      // 🆕 성별 데이터 처리
      if (naverApiData?.genderData?.male?.results?.[0]?.data && naverApiData?.genderData?.female?.results?.[0]?.data) {
        const maleData = naverApiData.genderData.male.results[0].data;
        const femaleData = naverApiData.genderData.female.results[0].data;
        
        // 최신 데이터 포인트의 성별 비율 사용 (가장 최근 월)
        if (maleData.length > 0 && femaleData.length > 0) {
          const latestMaleRatio = maleData[maleData.length - 1].ratio;
          const latestFemaleRatio = femaleData[femaleData.length - 1].ratio;
          
          genderRatios = {
            keywordId,
            keyword,
            maleRatio: parseFloat(latestMaleRatio.toFixed(2)),
            femaleRatio: parseFloat(latestFemaleRatio.toFixed(2)),
            analysisDate: analysisDate.value,
          };
          
          console.log(`📊 성별 비율 데이터 추출: ${keyword} - 남성: ${latestMaleRatio.toFixed(2)}%, 여성: ${latestFemaleRatio.toFixed(2)}%`);
        }
      } else {
        console.log(`⚠️ 성별 데이터 없음: ${keyword}`, {
          hasGenderData: !!naverApiData?.genderData,
          hasMale: !!naverApiData?.genderData?.male,
          hasFemale: !!naverApiData?.genderData?.female,
          naverApiDataKeys: naverApiData ? Object.keys(naverApiData) : 'naverApiData is null/undefined'
        });
      }
    } catch (error) {
      console.error('❌ 네이버 API 차트 데이터 추출 오류:', error);
    }

    return {
      searchTrends,
      monthlyRatios,
      genderRatios,
    };
  }
}
