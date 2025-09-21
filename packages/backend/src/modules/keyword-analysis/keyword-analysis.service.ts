import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeywordAnalytics } from '../../database/entities/keyword-analytics.entity';
import { RelatedKeywords, SimilarityScore } from '../../database/entities/related-keywords.entity';
import { SearchTrends, PeriodType } from '../../database/entities/search-trends.entity';
import { MonthlySearchRatios } from '../../database/entities/monthly-search-ratios.entity';
import { WeekdaySearchRatios } from '../../database/entities/weekday-search-ratios.entity';
import { GenderSearchRatios } from '../../database/entities/gender-search-ratios.entity';
import { IssueAnalysis, IssueType, TrendDirection } from '../../database/entities/issue-analysis.entity';
import { IntentAnalysis, PrimaryIntent } from '../../database/entities/intent-analysis.entity';

@Injectable()
export class KeywordAnalysisService {
  constructor(
    @InjectRepository(KeywordAnalytics)
    private keywordAnalyticsRepository: Repository<KeywordAnalytics>,
    @InjectRepository(RelatedKeywords)
    private relatedKeywordsRepository: Repository<RelatedKeywords>,
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
  ) {}

  async analyzeKeyword(keyword: string, analysisDate?: string, naverApiData?: any, relatedKeywordsData?: any[]): Promise<{
    analytics: KeywordAnalytics;
    relatedKeywords: RelatedKeywords[];
    chartData: {
      searchTrends: SearchTrends[];
      monthlyRatios: MonthlySearchRatios[];
      weekdayRatios: WeekdaySearchRatios[];
      genderRatios: GenderSearchRatios;
      issueAnalysis: IssueAnalysis;
      intentAnalysis: IntentAnalysis;
    };
  }> {
    console.log(`📊 키워드 분석 시작: ${keyword}`);

    try {
      // Check if analysis for this keyword and date already exists
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
      
      // 1. 기본 키워드 분석 데이터 저장 (외부에서 전달받은 네이버 API 데이터 사용)
      const analyticsData = await this.generateAndSaveKeywordAnalytics(keyword, currentDate, naverApiData);
      
      // 2. 연관 키워드 데이터 저장 (외부에서 전달받은 데이터 사용)
      const relatedKeywords = relatedKeywordsData && relatedKeywordsData.length > 0 
        ? await this.saveRelatedKeywords(keyword, relatedKeywordsData, currentDate)
        : [];
      
      // 3. 차트 데이터 저장 (외부에서 전달받은 네이버 데이터랩 데이터 사용)
      const chartData = await this.generateAndSaveChartData(keyword, currentDate, naverApiData);

      console.log(`✅ 키워드 분석 완료: ${keyword}`);

      return {
        analytics: analyticsData,
        relatedKeywords: relatedKeywords,
        chartData: chartData,
      };
    } catch (error) {
      console.error('❌ KeywordAnalysisService.analyzeKeyword 오류:', error);
      throw error;
    }
  }

  async getKeywordAnalysis(keyword: string) {
    console.log(`📊 키워드 분석 데이터 조회: ${keyword}`);

    try {
      // 최신 분석 데이터 조회
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

      // 연관 키워드 조회
      const relatedKeywords = await this.relatedKeywordsRepository.find({
        where: { baseKeyword: keyword, analysisDate: analytics.analysisDate },
        order: { rankPosition: 'ASC' },
      });

      // 차트 데이터 조회
      const chartData = await this.getAllChartData(keyword, analytics.analysisDate);

      return {
        success: true,
        data: {
          analytics,
          relatedKeywords,
          chartData,
        },
      };
    } catch (error) {
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
    } catch (error) {
      console.error('❌ KeywordAnalysisService.getAnalyzedKeywords 오류:', error);
      throw error;
    }
  }

  private async generateAndSaveKeywordAnalytics(keyword: string, analysisDate: Date, naverApiData?: any) {
    // 네이버 API 원본 데이터만 사용, 계산 로직 제거
    const analyticsData = {
      keyword,
      // 네이버 데이터랩 원본 데이터 사용 (ratio 값 그대로)
      monthlySearchPc: naverApiData?.datalab?.results?.[0]?.data?.[0]?.ratio || 0,
      monthlySearchMobile: naverApiData?.datalab?.results?.[0]?.data?.[1]?.ratio || 0,
      monthlySearchTotal: naverApiData?.datalab?.results?.[0]?.data?.reduce((sum: number, item: any) => sum + item.ratio, 0) || 0,
      // 네이버 블로그 검색 원본 데이터 사용
      monthlyContentBlog: naverApiData?.blogSearch?.total || 0,
      monthlyContentCafe: 0, // 카페 검색 API가 없으므로 0
      monthlyContentAll: naverApiData?.blogSearch?.total || 0,
      // 추정 데이터 제거, 원본 데이터만 사용
      estimatedSearchYesterday: 0,
      estimatedSearchEndMonth: 0,
      saturationIndexBlog: 0,
      saturationIndexCafe: 0,
      saturationIndexAll: 0,
      analysisDate,
    };

    try {
        // UPSERT: INSERT ... ON DUPLICATE KEY UPDATE 방식으로 중복 처리
        const result = await this.keywordAnalyticsRepository
          .createQueryBuilder()
          .insert()
          .into(KeywordAnalytics)
          .values(analyticsData)
          .orUpdate(['monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total', 
                    'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
                    'estimated_search_yesterday', 'estimated_search_end_month',
                    'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
                    'updated_at'], ['keyword', 'analysis_date'])
          .execute();

      // 저장된 데이터 조회하여 반환
      return await this.keywordAnalyticsRepository.findOne({
        where: { keyword, analysisDate }
      });
    } catch (error) {
      console.error('❌ generateAndSaveKeywordAnalytics 오류:', error);
      // 중복 키 에러인 경우 기존 데이터 조회하여 반환
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ 중복 키 에러 발생, 기존 데이터 조회: ${keyword}`);
        return await this.keywordAnalyticsRepository.findOne({
          where: { keyword, analysisDate }
        });
      }
      throw error;
    }
  }

  async saveRelatedKeywords(keyword: string, relatedKeywordsData: any[], analysisDate: Date) {
    try {
      // 기존 연관 키워드 데이터 삭제 (중복 방지)
      await this.relatedKeywordsRepository.delete({
        baseKeyword: keyword,
        analysisDate,
      });

      // 외부에서 전달받은 연관 키워드 데이터를 저장 (데이터 생성하지 않음)
      const relatedKeywords = relatedKeywordsData.map((item, index) => ({
        baseKeyword: keyword,
        relatedKeyword: item.keyword,
        monthlySearchVolume: item.monthlySearchVolume || 0,
        blogCumulativePosts: 0, // 블로그 누적 게시물 수는 별도 API 필요
        similarityScore: SimilarityScore.MEDIUM,
        rankPosition: index + 1,
        analysisDate,
      }));
      
      return await this.relatedKeywordsRepository.save(relatedKeywords);
    } catch (error) {
      console.error('❌ saveRelatedKeywords 오류:', error);
      throw error;
    }
  }

  private async generateAndSaveChartData(keyword: string, analysisDate: Date, naverApiData?: any) {
    const currentYear = new Date().getFullYear();
    
    try {
      // 기존 차트 데이터 삭제 (중복 방지)
      await Promise.all([
        this.searchTrendsRepository.delete({ keyword }),
        this.monthlySearchRatiosRepository.delete({ keyword, analysisYear: currentYear }),
        this.weekdaySearchRatiosRepository.delete({ keyword, analysisDate }),
        this.genderSearchRatiosRepository.delete({ keyword, analysisDate }),
        this.issueAnalysisRepository.delete({ keyword, analysisDate }),
        this.intentAnalysisRepository.delete({ keyword, analysisDate }),
      ]);

      // 검색량 트렌드 데이터 (네이버 데이터랩 원본 데이터만 사용)
      const searchTrends = [];
      if (naverApiData?.datalab?.results?.[0]?.data) {
        // 네이버 데이터랩 원본 데이터 그대로 사용
        const datalabData = naverApiData.datalab.results[0].data;
        for (const dataPoint of datalabData) {
          const trend = this.searchTrendsRepository.create({
            keyword,
            periodType: PeriodType.MONTHLY,
            periodValue: dataPoint.period,
            searchVolume: dataPoint.ratio, // 원본 ratio 값 그대로 사용
            searchRatio: dataPoint.ratio,
          });
          searchTrends.push(trend);
        }
        await this.searchTrendsRepository.save(searchTrends);
      }

      // 월별 검색 비율 데이터 (네이버 데이터랩 원본 데이터만 사용)
      const monthlyRatios = [];
      if (naverApiData?.datalab?.results?.[0]?.data) {
        const datalabData = naverApiData.datalab.results[0].data;
        datalabData.forEach((dataPoint, index) => {
          const monthMatch = dataPoint.period.match(/-(\d{2})-/);
          const monthNumber = monthMatch ? parseInt(monthMatch[1]) : index + 1;
          
          const ratio = this.monthlySearchRatiosRepository.create({
            keyword,
            monthNumber,
            searchRatio: dataPoint.ratio, // 원본 ratio 값 그대로 사용
            analysisYear: currentYear,
          });
          monthlyRatios.push(ratio);
        });
        await this.monthlySearchRatiosRepository.save(monthlyRatios);
      }

      // 요일별, 성별, 이슈성, 의도 분석은 네이버 API에서 제공하지 않으므로 
      // 계산 로직 제거하고 빈 데이터로 처리
      const weekdayRatios: WeekdaySearchRatios[] = [];
      let genderRatio: GenderSearchRatios | null = null;
      let issueAnalysis: IssueAnalysis | null = null;
      let intentAnalysis: IntentAnalysis | null = null;

      return {
        searchTrends,
        monthlyRatios,
        weekdayRatios,
        genderRatios: genderRatio,
        issueAnalysis,
        intentAnalysis,
      };
    } catch (error) {
      console.error('❌ generateAndSaveChartData 오류:', error);
      throw error;
    }
  }

  private async getAllChartData(keyword: string, analysisDate: Date) {
    const [
      searchTrends,
      monthlyRatios,
      weekdayRatios,
      genderRatios,
      issueAnalysis,
      intentAnalysis,
    ] = await Promise.all([
      this.searchTrendsRepository.find({
        where: { keyword, periodType: PeriodType.MONTHLY },
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
}
