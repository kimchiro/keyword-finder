import { Injectable } from '@nestjs/common';
import { NaverApiService } from '../naver-api/naver-api.service';
import { ScrapingService } from '../scraping/scraping.service';
import { KeywordAnalysisService } from '../keyword-analysis/keyword-analysis.service';
import { AppConfigService } from '../../config/app.config';

export interface WorkflowResult {
  success: boolean;
  data: {
    query: string;
    scrapingData: any;      // 스크래핑 결과 (smartblock, related_search 분류 포함)
    naverApiData: any;      // 1개 키워드 네이버 API 결과
    analysisData: any;      // 키워드 분석 데이터
    topKeywords: string[];  // 상위 키워드 목록
    keywordsWithRank: Array<{
      keyword: string;
      originalRank: number;
      category: string;
      source: string;
    }>;                     // 순위와 함께 키워드 정보
    executionTime: number;
    timestamp: string;
  };
  message: string;
}

@Injectable()
export class WorkflowService {
  constructor(
    private readonly naverApiService: NaverApiService,
    private readonly scrapingService: ScrapingService,
    private readonly keywordAnalysisService: KeywordAnalysisService,
    private readonly appConfig: AppConfigService,
  ) {}

  /**
   * 단순화된 키워드 분석 워크플로우
   * 1. 스크래핑 실행 (smartblock, related_search)
   * 2. 스크래핑 데이터 DB 저장 (카테고리 분류, rank 없음)
   * 3. 네이버 API 1개 키워드 데이터 수집
   * 4. 통합 결과 반환
   */
  async executeCompleteWorkflow(query: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`🚀 워크플로우 시작: ${query}`);

    try {
      // Step 1: 스크래핑 실행 (smartblock + related_search)
      console.log(`🕷️ Step 1: 스크래핑 실행`);
      const scrapingResult = await this.scrapingService.scrapeKeywords({
        query,
        types: ['smartblock', 'related_search'],
        maxResults: this.appConfig.scrapingMaxResults,
      });

      if (!scrapingResult || !scrapingResult.keywords) {
        throw new Error('스크래핑 데이터를 가져올 수 없습니다.');
      }

      console.log(`✅ 스크래핑 완료: ${scrapingResult.keywords.length}개 키워드`);

      // Step 2: 스크래핑 데이터 DB 저장 (카테고리 분류, rank 없음)
      console.log(`💾 Step 2: 스크래핑 데이터 DB 저장`);
      const savedScrapingData = await this.keywordAnalysisService.saveScrapingData(query, scrapingResult);

      // Step 3: 네이버 API 1개 키워드 데이터 수집
      console.log(`📊 Step 3: 네이버 API 호출 - "${query}"`);
      const naverApiResult = await this.naverApiService.getSingleKeywordFullData({ keyword: query });

      console.log(`✅ 네이버 API 호출 완료`);

      // Step 4: 키워드 분석 데이터 저장 및 조회
      console.log(`📊 Step 4: 키워드 분석 데이터 저장`);
      let analysisData = null;
      try {
        const analysisResult = await this.keywordAnalysisService.analyzeKeyword(
          query, 
          undefined, 
          naverApiResult.data
        );
        analysisData = analysisResult;
        console.log(`✅ 키워드 분석 데이터 저장 완료`);
      } catch (error) {
        console.warn(`⚠️ 키워드 분석 데이터 저장 실패 (계속 진행): ${error.message}`);
      }

      const executionTime = (Date.now() - startTime) / 1000;
      console.log(`🎉 워크플로우 완료: ${query} (${executionTime}초)`);

      // Step 5: 완전한 통합 결과 반환
      return {
        success: true,
        data: {
          query,
          scrapingData: savedScrapingData,     // DB에 저장된 스크래핑 데이터 (이제 완전한 구조)
          naverApiData: naverApiResult.data,   // 네이버 API 결과
          analysisData: analysisData,          // 키워드 분석 데이터
          topKeywords: savedScrapingData?.topKeywords || [],
          keywordsWithRank: savedScrapingData?.keywordsWithRank || [],
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `키워드 "${query}" 분석이 완료되었습니다.`,
      };

    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      console.error('❌ 워크플로우 실행 실패:', error);
      
      return {
        success: false,
        data: {
          query,
          scrapingData: null,
          naverApiData: null,
          analysisData: null,
          topKeywords: [],
          keywordsWithRank: [],
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `키워드 "${query}" 분석 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  /**
   * 워크플로우 상태 체크
   */
  async checkWorkflowHealth(): Promise<{
    success: boolean;
    services: {
      naverApi: boolean;
      scraping: boolean;
      keywordAnalysis: boolean;
    };
    message: string;
  }> {
    console.log('🔍 워크플로우 상태 체크 시작');

    const healthChecks = await Promise.allSettled([
      // 네이버 API 상태 체크
      this.naverApiService.getSingleKeywordFullData({ keyword: '테스트' }).catch(() => false),
      // 스크래핑 서비스 상태 체크
      this.scrapingService.getScrapingStats().catch(() => false),
      // 분석 서비스 상태 체크
      this.keywordAnalysisService.getKeywordAnalysis('테스트').catch(() => false),
    ]);

    const serviceStatus = {
      naverApi: healthChecks[0].status === 'fulfilled' && healthChecks[0].value !== false,
      scraping: healthChecks[1].status === 'fulfilled' && healthChecks[1].value !== false,
      keywordAnalysis: healthChecks[2].status === 'fulfilled' && healthChecks[2].value !== false,
    };

    const allHealthy = Object.values(serviceStatus).every(status => status);

    console.log('✅ 워크플로우 상태 체크 완료:', serviceStatus);

    return {
      success: allHealthy,
      services: serviceStatus,
      message: allHealthy 
        ? '모든 서비스가 정상 작동 중입니다.' 
        : '일부 서비스에 문제가 있습니다.',
    };
  }
}