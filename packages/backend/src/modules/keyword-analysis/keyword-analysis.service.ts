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

  async analyzeKeyword(keyword: string, analysisDate?: string) {
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
        return this.getKeywordAnalysis(keyword);
      }

      const currentDate = analysisDate ? new Date(analysisDate) : new Date();
      
      // 1. 기본 키워드 분석 데이터 생성 및 저장
      const analyticsData = await this.generateAndSaveKeywordAnalytics(keyword, currentDate);
      
      // 2. 연관 키워드 데이터 생성 및 저장
      const relatedKeywordsData = await this.generateAndSaveRelatedKeywords(keyword, currentDate);
      
      // 3. 차트 데이터 생성 및 저장
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

  private async generateAndSaveKeywordAnalytics(keyword: string, analysisDate: Date) {
    // 모의 데이터 생성 (실제로는 네이버 API나 다른 데이터 소스에서 가져와야 함)
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

  private async generateAndSaveRelatedKeywords(keyword: string, analysisDate: Date) {
    const relatedKeywords = [];
    const similarityOptions = [SimilarityScore.LOW, SimilarityScore.MEDIUM, SimilarityScore.HIGH];
    
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

  private async generateAndSaveChartData(keyword: string, analysisDate: Date) {
    const currentYear = new Date().getFullYear();
    
    // 검색량 트렌드 데이터
    const searchTrends = [];
    for (let i = 1; i <= 12; i++) {
      const trend = this.searchTrendsRepository.create({
        keyword,
        periodType: PeriodType.MONTHLY,
        periodValue: `${currentYear}-${String(i).padStart(2, '0')}`,
        searchVolume: Math.floor(Math.random() * 100000) + 10000,
        searchRatio: Math.floor(Math.random() * 100),
      });
      searchTrends.push(trend);
    }
    await this.searchTrendsRepository.save(searchTrends);

    // 월별 검색 비율 데이터
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

    // 요일별 검색 비율 데이터
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

    // 성별 검색 비율 데이터
    const genderRatio = this.genderSearchRatiosRepository.create({
      keyword,
      maleRatio: Math.floor(Math.random() * 40) + 30,
      femaleRatio: Math.floor(Math.random() * 40) + 30,
      analysisDate,
    });
    await this.genderSearchRatiosRepository.save(genderRatio);

    // 이슈성 분석 데이터
    const issueTypes = [IssueType.RISING, IssueType.STABLE, IssueType.FALLING, IssueType.NEW];
    const trendDirections = [TrendDirection.UP, TrendDirection.DOWN, TrendDirection.MAINTAIN];
    
    const issueAnalysis = this.issueAnalysisRepository.create({
      keyword,
      issueType: issueTypes[Math.floor(Math.random() * issueTypes.length)],
      issueScore: Math.floor(Math.random() * 100),
      trendDirection: trendDirections[Math.floor(Math.random() * trendDirections.length)],
      volatilityScore: Math.floor(Math.random() * 100),
      analysisDate,
    });
    await this.issueAnalysisRepository.save(issueAnalysis);

    // 검색 의도 분석 데이터
    const primaryIntents = [PrimaryIntent.INFORMATIONAL, PrimaryIntent.COMMERCIAL, PrimaryIntent.MIXED];
    
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
