import { Injectable } from '@nestjs/common';
import { Keyword, AnalysisDate, SearchVolume } from '../value-objects';
import { KeywordDataService } from './keyword-data.service';
import { ChartDataService } from './chart-data.service';
import { KeywordAnalysisAggregate } from '../aggregates/keyword-analysis.aggregate';

// 키워드 분석 도메인 서비스 - 순수한 비즈니스 로직을 담당
@Injectable()
export class KeywordAnalysisDomainService {
  constructor(
    private keywordDataService: KeywordDataService,
    private chartDataService: ChartDataService,
  ) {}

  // 키워드 분석 실행
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

    // 검색량 데이터 추출 및 검증
    const searchVolume = this.extractSearchVolume(naverApiData);

    // 키워드 분석 데이터 저장
    const analytics = await this.keywordDataService.saveKeywordAnalytics(
      keyword,
      analysisDate,
      searchVolume,
      naverApiData,
    );

    // 연관 키워드 데이터 저장
    const relatedKeywords = await this.keywordDataService.saveRelatedKeywords(
      keyword,
      analysisDate,
      relatedKeywordsData || [],
    );

    // 차트 데이터 저장
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

  // 네이버 API 데이터에서 검색량 추출
  private extractSearchVolume(naverApiData?: any): SearchVolume {
    if (!naverApiData?.datalab?.results?.[0]?.data) {
      console.log('⚠️ 네이버 데이터랩 응답 데이터가 없습니다. 기본값 반환');
      return SearchVolume.zero();
    }

    const datalabData = naverApiData.datalab.results[0].data;
    
    // PC와 모바일 데이터가 분리되어 있는 경우
    if (datalabData.length >= 2) {
      const pcRatio = this.safeParseNumber(datalabData[0]?.ratio, 0);
      const mobileRatio = this.safeParseNumber(datalabData[1]?.ratio, 0);
      console.log(`📊 PC/모바일 분리 데이터: PC=${pcRatio}, Mobile=${mobileRatio}`);
      return new SearchVolume(pcRatio, mobileRatio);
    }

    // 통합 데이터인 경우 (50:50 비율로 가정)
    if (datalabData.length === 1) {
      const totalRatio = this.safeParseNumber(datalabData[0]?.ratio, 0);
      console.log(`📊 통합 데이터: Total=${totalRatio}`);
      return SearchVolume.fromTotal(totalRatio, 50);
    }

    console.log('⚠️ 유효한 데이터랩 데이터가 없습니다. 기본값 반환');
    return SearchVolume.zero();
  }

  // 안전한 숫자 파싱 헬퍼 메서드
  private safeParseNumber(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    
    if (isNaN(parsed) || !isFinite(parsed)) {
      console.warn(`⚠️ 유효하지 않은 숫자 값: ${value}, 기본값 ${defaultValue} 사용`);
      return defaultValue;
    }
    
    return parsed;
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
