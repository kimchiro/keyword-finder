import { Injectable } from '@nestjs/common';
import { NaverApiService } from '../naver-api/naver-api.service';
import { ScrapingService } from '../scraping/scraping.service';
import { KeywordAnalysisService } from '../keyword-analysis/keyword-analysis.service';
import { AppConfigService } from '../../config/app.config';
import { SCRAPING_DEFAULTS } from '../../constants/scraping.constants';

export interface WorkflowResult {
  success: boolean;
  data: {
    query: string;
    naverApiData: any;
    scrapingData: any;
    analysisData: any;
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
   * 완전한 키워드 분석 워크플로우 실행
   * 1. 네이버 API 호출 (블로그 검색 + 데이터랩)
   * 2. 병렬로 Playwright 스크래핑 실행
   * 3. 모든 데이터를 데이터베이스에 저장
   * 4. 통합된 분석 결과 반환
   */
  async executeCompleteWorkflow(query: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`🚀 완전한 워크플로우 시작: ${query}`);

    try {
      // Phase 1: 네이버 API 호출과 스크래핑을 병렬로 실행
      console.log(`⚡ Phase 1: API 호출 및 스크래핑 병렬 실행`);
      const [naverApiResult, scrapingResult] = await Promise.allSettled([
        this.naverApiService.getIntegratedData(query),
        this.scrapingService.scrapeKeywords({
          query,
          types: ['related_search'],
          maxResults: this.appConfig.scrapingMaxResults,
        }),
      ]);

      // 결과 검증 및 추출
      const naverApiData = naverApiResult.status === 'fulfilled' 
        ? naverApiResult.value.data 
        : null;
      const scrapingData = scrapingResult.status === 'fulfilled' 
        ? scrapingResult.value 
        : null;

      if (naverApiResult.status === 'rejected') {
        console.warn('⚠️ 네이버 API 호출 실패:', naverApiResult.reason);
      }
      if (scrapingResult.status === 'rejected') {
        console.warn('⚠️ 스크래핑 실패:', scrapingResult.reason);
      }

      // Phase 2: 네이버 API에서 연관 키워드 생성 및 키워드 분석 데이터 생성
      console.log(`📊 Phase 2: 연관 키워드 및 분석 데이터 생성`);
      let analysisData = null;
      
      try {
        // 2-1: 스크래핑된 연관검색어로 네이버 데이터랩 트렌드 조회
        let relatedKeywordsData = [];
        
        if (scrapingData?.keywords) {
          // 스크래핑된 연관검색어 필터링
          const relatedSearchKeywords = scrapingData.keywords
            .filter(k => k.category === 'related_search')
            .slice(0, this.appConfig.scrapingMaxKeywordsPerType)
            .map(k => k.keyword);
          
          if (relatedSearchKeywords.length > 0) {
            try {
              console.log(`🔗 연관검색어 트렌드 조회: ${relatedSearchKeywords.join(', ')}`);
              
              // 네이버 데이터랩으로 연관검색어 트렌드 조회
              const keywordGroups = [
                {
                  groupName: query,
                  keywords: [query],
                },
                ...relatedSearchKeywords.slice(0, 4).map((keyword, index) => ({
                  groupName: `연관키워드${index + 1}`,
                  keywords: [keyword],
                })),
              ];

              const datalabResult = await this.naverApiService.getDatalab({
                startDate: this.appConfig.defaultStartDate,
                endDate: this.appConfig.defaultEndDate,
                timeUnit: 'month',
                keywordGroups,
              });

              // 연관 키워드와 트렌드 데이터를 조합
              relatedKeywordsData = relatedSearchKeywords.map((keyword, index) => {
                const trendData = datalabResult.data?.results?.find(
                  (result: any) => result.title === `연관키워드${index + 1}`
                );
                
                const latestRatio = trendData?.data?.[trendData.data.length - 1]?.ratio || 0;

                return {
                  keyword,
                  monthlySearchVolume: latestRatio,
                  rankPosition: index + 1,
                  trendData: trendData?.data || []
                };
              });
              
              console.log(`✅ 연관검색어 트렌드 조회 완료: ${relatedKeywordsData.length}개`);
            } catch (relatedError) {
              console.warn('⚠️ 연관검색어 트렌드 조회 실패:', relatedError);
            }
          }
        }

        // 2-2: 키워드 분석 서비스에서 데이터 저장
        const analysisResult = await this.keywordAnalysisService.analyzeKeyword(
          query, 
          undefined, 
          naverApiData, 
          relatedKeywordsData
        );
        analysisData = analysisResult;
      } catch (analysisError) {
        console.warn('⚠️ 키워드 분석 실패:', analysisError);
      }

      const executionTime = (Date.now() - startTime) / 1000;
      
      console.log(`✅ 완전한 워크플로우 완료: ${query} (${executionTime}초)`);

      return {
        success: true,
        data: {
          query,
          naverApiData,
          scrapingData,
          analysisData,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: '키워드 분석 워크플로우가 성공적으로 완료되었습니다.',
      };
    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      console.error('❌ 워크플로우 실행 실패:', error);
      
      return {
        success: false,
        data: {
          query,
          naverApiData: null,
          scrapingData: null,
          analysisData: null,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  /**
   * 빠른 키워드 분석 (API만 사용, 스크래핑 제외)
   */
  async executeQuickAnalysis(query: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`⚡ 빠른 분석 시작: ${query}`);

    try {
      // 네이버 API 호출
      const naverApiResult = await this.naverApiService.getIntegratedData(query);

      const executionTime = (Date.now() - startTime) / 1000;
      
      console.log(`✅ 빠른 분석 완료: ${query} (${executionTime}초)`);

      return {
        success: true,
        data: {
          query,
          naverApiData: naverApiResult.data,
          scrapingData: null,
          analysisData: null,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: '빠른 키워드 분석이 완료되었습니다.',
      };
    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      console.error('❌ 빠른 분석 실패:', error);
      
      return {
        success: false,
        data: {
          query,
          naverApiData: null,
          scrapingData: null,
          analysisData: null,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `빠른 분석 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  /**
   * 스크래핑 전용 워크플로우
   */
  async executeScrapingOnly(query: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`🕷️ 스크래핑 전용 워크플로우 시작: ${query}`);

    try {
      const scrapingResult = await this.scrapingService.scrapeKeywords({
        query,
        types: ['trending', 'smartblock'],
        maxResults: this.appConfig.scrapingMaxResults * 2, // 스크래핑 전용이므로 2배
      });

      const executionTime = (Date.now() - startTime) / 1000;
      
      console.log(`✅ 스크래핑 전용 워크플로우 완료: ${query} (${executionTime}초)`);

      return {
        success: true,
        data: {
          query,
          naverApiData: null,
          scrapingData: scrapingResult,
          analysisData: null,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: '키워드 스크래핑이 완료되었습니다.',
      };
    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      console.error('❌ 스크래핑 워크플로우 실패:', error);
      
      return {
        success: false,
        data: {
          query,
          naverApiData: null,
          scrapingData: null,
          analysisData: null,
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `스크래핑 워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  /**
   * 워크플로우 상태 체크
   */
  async checkWorkflowHealth(): Promise<{
    naverApi: boolean;
    scraping: boolean;
    analysis: boolean;
    overall: boolean;
  }> {
    console.log('🔍 워크플로우 상태 체크 시작');

    const healthChecks = await Promise.allSettled([
      // 네이버 API 상태 체크
      this.naverApiService.getIntegratedData('테스트').catch(() => false),
      // 스크래핑 서비스 상태 체크 (간단한 테스트)
      this.scrapingService.getScrapingStats().catch(() => false),
      // 분석 서비스 상태 체크
      this.keywordAnalysisService.getKeywordAnalysis('테스트').catch(() => false),
    ]);

    const naverApi = healthChecks[0].status === 'fulfilled' && healthChecks[0].value !== false;
    const scraping = healthChecks[1].status === 'fulfilled' && healthChecks[1].value !== false;
    const analysis = healthChecks[2].status === 'fulfilled' && healthChecks[2].value !== false;
    const overall = naverApi && scraping && analysis;

    console.log(`📊 워크플로우 상태: API(${naverApi}), 스크래핑(${scraping}), 분석(${analysis}), 전체(${overall})`);

    return {
      naverApi,
      scraping,
      analysis,
      overall,
    };
  }
}
