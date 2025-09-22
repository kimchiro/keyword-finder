import { Injectable } from '@nestjs/common';
import { Keyword, AnalysisDate } from '../value-objects';
import { KeywordDataService } from './keyword-data.service';
import { ChartDataService } from './chart-data.service';
import { KeywordAnalysisAggregate } from '../aggregates/keyword-analysis.aggregate';

// 키워드 분석 도메인 서비스 - 네이버 API 결과 저장 및 조회 (단순화됨)
@Injectable()
export class KeywordAnalysisDomainService {
  constructor(
    private keywordDataService: KeywordDataService,
    private chartDataService: ChartDataService,
  ) {}

  // 키워드 분석 실행 - 네이버 API 결과를 직접 저장
  async analyzeKeyword(
    keywordValue: string,
    analysisDateValue?: string,
    naverApiData?: any,
    relatedKeywordsData?: any[],
  ): Promise<KeywordAnalysisAggregate> {
    console.log(`📊 키워드 분석 시작: ${keywordValue}`);

    // Value Object 생성
    const keyword = new Keyword(keywordValue);
    const analysisDate = new AnalysisDate(analysisDateValue);

    // 기존 분석 데이터 확인
    const existingAnalytics = await this.keywordDataService.findKeywordAnalyticsByDate(
      keyword,
      analysisDate,
    );

    if (existingAnalytics) {
      console.log(`⚠️ 키워드 '${keywordValue}'에 대한 분석 데이터가 이미 존재합니다. 기존 데이터를 반환합니다.`);
      return await this.getExistingAnalysis(keyword, analysisDate);
    }

    // 네이버 API 결과를 직접 저장 (계산 로직 제거)
    const analytics = await this.keywordDataService.saveKeywordAnalytics(
      keyword,
      analysisDate,
      naverApiData,
    );

    // 연관 키워드 데이터 저장
    const relatedKeywords = await this.keywordDataService.saveRelatedKeywords(
      keyword,
      analysisDate,
      relatedKeywordsData || [],
    );

    // 차트 데이터 저장 (네이버 API 결과 직접 사용)
    const chartData = await this.chartDataService.saveChartData(
      keyword,
      analysisDate,
      naverApiData,
    );

    console.log(`✅ 키워드 분석 완료: ${keywordValue}`);

    return new KeywordAnalysisAggregate(
      keyword,
      analysisDate,
      analytics,
      relatedKeywords,
      chartData,
    );
  }

  // 키워드 분석 데이터 조회
  async getKeywordAnalysis(keywordValue: string): Promise<{
    success: boolean;
    data: KeywordAnalysisAggregate | null;
  }> {
    console.log(`📊 키워드 분석 데이터 조회: ${keywordValue}`);

    try {
      const keyword = new Keyword(keywordValue);
      
      // 최신 분석 데이터 조회
      const analytics = await this.keywordDataService.findKeywordAnalytics(keyword);

      if (!analytics) {
        return {
          success: false,
          data: null,
        };
      }

      const analysisDate = new AnalysisDate(analytics.analysisDate);
      const aggregate = await this.getExistingAnalysis(keyword, analysisDate);

      return {
        success: true,
        data: aggregate,
      };
    } catch (error) {
      console.error('❌ KeywordAnalysisDomainService.getKeywordAnalysis 오류:', error);
      throw error;
    }
  }

  // 분석된 키워드 목록 조회
  async getAnalyzedKeywords(): Promise<any[]> {
    try {
      return await this.keywordDataService.findAnalyzedKeywords();
    } catch (error) {
      console.error('❌ KeywordAnalysisDomainService.getAnalyzedKeywords 오류:', error);
      throw error;
    }
  }

  // 스크래핑 데이터 저장
  async saveScrapingData(query: string, scrapingData: any): Promise<void> {
    try {
      console.log(`💾 스크래핑 데이터 저장 시작: ${query}`);
      
      const keyword = new Keyword(query);
      const analysisDate = new AnalysisDate();
      
      // 스크래핑된 키워드 데이터를 데이터베이스에 저장
      await this.keywordDataService.saveScrapedKeywords(keyword, analysisDate, scrapingData);
      
      console.log(`✅ 스크래핑 데이터 저장 완료: ${query}`);
    } catch (error) {
      console.error('❌ KeywordAnalysisDomainService.saveScrapingData 오류:', error);
      throw error;
    }
  }

  // 저장된 스크래핑 키워드 조회
  async getScrapedKeywords(query: string): Promise<any[]> {
    try {
      console.log(`🔍 스크래핑 키워드 조회: ${query}`);
      
      const keyword = new Keyword(query);
      const result = await this.keywordDataService.findScrapedKeywords(keyword);
      
      console.log(`✅ 스크래핑 키워드 조회 완료: ${result.length}개`);
      return result;
    } catch (error) {
      console.error('❌ KeywordAnalysisDomainService.getScrapedKeywords 오류:', error);
      throw error;
    }
  }


  // 기존 분석 데이터 조회
  private async getExistingAnalysis(
    keyword: Keyword,
    analysisDate: AnalysisDate,
  ): Promise<KeywordAnalysisAggregate> {
    const [analytics, relatedKeywords, chartData] = await Promise.all([
      this.keywordDataService.findKeywordAnalyticsByDate(keyword, analysisDate),
      this.keywordDataService.findRelatedKeywords(keyword, analysisDate),
      this.chartDataService.getChartData(keyword, analysisDate),
    ]);

    if (!analytics) {
      throw new Error(`키워드 '${keyword.value}'의 분석 데이터를 찾을 수 없습니다.`);
    }

    return new KeywordAnalysisAggregate(
      keyword,
      analysisDate,
      analytics,
      relatedKeywords,
      chartData,
    );
  }
}
