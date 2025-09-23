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
    contentCounts?: any; // 🆕 콘텐츠 수 데이터 추가
    scrapingData: any;
    analysisData: any;
    topKeywords?: string[];
    keywordsWithRank?: Array<{
      keyword: string;
      originalRank: number;
      category: string;
      source: string;
    }>;
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
   * 완전한 키워드 분석 워크플로우 실행 (새로운 순서)
   * 1. 스크래핑 실행 (스마트블록, 연관검색어)
   * 2. 스크래핑 데이터를 데이터베이스에 저장
   * 3. DB에서 rank 1-5 키워드 추출 (스마트블록 + 연관검색어)
   * 4. 원본 키워드(1개) + 추출된 키워드(5개) = 총 6개로 네이버 API 호출
   * 5. 통합된 분석 결과 반환
   */
  async executeCompleteWorkflow(query: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    console.log(`🚀 새로운 워크플로우 시작: ${query}`);

    try {
      // Phase 1: 스크래핑 실행 (스마트블록 + 연관검색어)
      console.log(`🕷️ Phase 1: 스크래핑 실행`);
      const scrapingResult = await this.scrapingService.scrapeKeywords({
        query,
        types: ['smartblock', 'related_search'],
        maxResults: this.appConfig.scrapingMaxResults,
      });

      if (!scrapingResult || !scrapingResult.keywords) {
        throw new Error('스크래핑 데이터를 가져올 수 없습니다.');
      }

      console.log(`✅ 스크래핑 완료: ${scrapingResult.keywords.length}개 키워드`);

      // Phase 2: 스크래핑 데이터를 데이터베이스에 저장
      console.log(`💾 Phase 2: 스크래핑 데이터 DB 저장`);
      await this.keywordAnalysisService.saveScrapingData(query, scrapingResult);

      // Phase 3: DB에서 rank 1-5 키워드 추출
      console.log(`🔍 Phase 3: DB에서 상위 5개 키워드 추출`);
      const extractedData = await this.extractTopKeywordsFromDB(query);
      const topKeywords = extractedData.keywords;
      const keywordsWithRank = extractedData.keywordsWithRank;
      
      if (topKeywords.length === 0) {
        console.warn('⚠️ 추출된 키워드가 없습니다. 원본 키워드만 사용합니다.');
      }

      // Phase 4: 네이버 API 호출 (요구사항에 맞게 3번 호출)
      console.log(`🌐 Phase 4: 네이버 API 호출 시작`);
      
      // 4-1: 원본 키워드 1개 API 호출 (통합 데이터 + 콘텐츠 수)
      console.log(`📞 API 호출 1: 원본 키워드 "${query}" (통합 데이터 + 콘텐츠 수)`);
      const [originalKeywordApiResult, contentCountsResult] = await Promise.all([
        this.naverApiService.getIntegratedData(query),
        this.naverApiService.getContentCounts(query)
      ]);
      
      // 4-2: 추출된 키워드 5개로 2번의 API 호출
      let firstBatchApiResult = null;
      let secondBatchApiResult = null;
      
      if (topKeywords.length > 0) {
        // 첫 번째 배치 (최대 5개 키워드)
        const firstBatch = topKeywords.slice(0, 5);
        if (firstBatch.length > 0) {
          console.log(`📞 API 호출 2: 첫 번째 배치 키워드 ${firstBatch.length}개 - ${firstBatch.join(', ')}`);
          
          const keywordGroups1 = firstBatch.map((keyword, index) => ({
            groupName: `키워드${index + 1}`,
            keywords: [keyword],
          }));

          firstBatchApiResult = await this.naverApiService.getDatalab({
            startDate: this.appConfig.defaultStartDate,
            endDate: this.appConfig.defaultEndDate,
            timeUnit: 'month',
            keywordGroups: keywordGroups1,
          });
        }

        // 두 번째 배치 (추가 키워드가 있다면)
        const secondBatch = topKeywords.slice(5, 10);
        if (secondBatch.length > 0) {
          console.log(`📞 API 호출 3: 두 번째 배치 키워드 ${secondBatch.length}개 - ${secondBatch.join(', ')}`);
          
          const keywordGroups2 = secondBatch.map((keyword, index) => ({
            groupName: `키워드${index + 6}`,
            keywords: [keyword],
          }));

          secondBatchApiResult = await this.naverApiService.getDatalab({
            startDate: this.appConfig.defaultStartDate,
            endDate: this.appConfig.defaultEndDate,
            timeUnit: 'month',
            keywordGroups: keywordGroups2,
          });
        }
      }
      
      console.log(`✅ 네이버 API 호출 완료 - 총 ${topKeywords.length > 5 ? 3 : topKeywords.length > 0 ? 2 : 1}번 호출`)

      // Phase 5: 키워드 분석 데이터 생성 및 저장
      console.log(`📊 Phase 5: 키워드 분석 데이터 생성`);
      const relatedKeywordsData = topKeywords.map((keyword, index) => {
        let trendData = null;
        
        // 첫 번째 배치에서 찾기 (인덱스 0-4)
        if (index < 5 && firstBatchApiResult?.data?.results) {
          trendData = firstBatchApiResult.data.results.find(
            (result: any) => result.title === `키워드${index + 1}`
          );
        }
        // 두 번째 배치에서 찾기 (인덱스 5-9)
        else if (index >= 5 && secondBatchApiResult?.data?.results) {
          trendData = secondBatchApiResult.data.results.find(
            (result: any) => result.title === `키워드${index + 1}`
          );
        }
        
        const latestRatio = trendData?.data?.[trendData.data.length - 1]?.ratio || 0;

        return {
          keyword,
          monthlySearchVolume: latestRatio,
          rankPosition: index + 1,
          trendData: trendData?.data || []
        };
      });

      const analysisData = await this.keywordAnalysisService.analyzeKeyword(
        query, 
        undefined, 
        originalKeywordApiResult.data, 
        relatedKeywordsData
      );

      const executionTime = (Date.now() - startTime) / 1000;
      
      console.log(`✅ 새로운 워크플로우 완료: ${query} (${executionTime}초)`);

      return {
        success: true,
        data: {
          query,
          naverApiData: {
            original: originalKeywordApiResult.data,
            firstBatch: firstBatchApiResult?.data || null,
            secondBatch: secondBatchApiResult?.data || null,
          },
          contentCounts: contentCountsResult.data, // 🆕 콘텐츠 수 데이터 추가
          scrapingData: scrapingResult,
          analysisData,
          topKeywords,
          keywordsWithRank,
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
          topKeywords: [],
          keywordsWithRank: [],
          executionTime,
          timestamp: new Date().toISOString(),
        },
        message: `워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  /**
   * DB에서 스마트블록과 연관검색어 상위 5개 키워드 추출 (rank 정보 포함)
   */
  private async extractTopKeywordsFromDB(query: string): Promise<{
    keywords: string[];
    keywordsWithRank: Array<{
      keyword: string;
      originalRank: number;
      category: string;
      source: string;
    }>;
  }> {
    try {
      // 키워드 분석 서비스를 통해 저장된 스크래핑 데이터 조회
      const savedData = await this.keywordAnalysisService.getScrapedKeywords(query);
      
      if (!savedData || savedData.length === 0) {
        return { keywords: [], keywordsWithRank: [] };
      }

      // 스마트블록 rank 1-5 추출
      const smartblockItems = savedData
        .filter(item => item.category === 'smartblock' && item.rankPosition >= 1 && item.rankPosition <= 5)
        .sort((a, b) => a.rankPosition - b.rankPosition);

      // 연관검색어 rank 1-5 추출
      const relatedSearchItems = savedData
        .filter(item => item.category === 'related_search' && item.rankPosition >= 1 && item.rankPosition <= 5)
        .sort((a, b) => a.rankPosition - b.rankPosition);

      // 스마트블록 우선, 연관검색어로 보완하여 최대 5개 반환
      const topKeywordsWithRank = [...smartblockItems];
      
      // 스마트블록이 5개 미만이면 연관검색어로 보완
      if (topKeywordsWithRank.length < 5) {
        const remainingSlots = 5 - topKeywordsWithRank.length;
        const additionalItems = relatedSearchItems
          .filter(item => !topKeywordsWithRank.some(existing => existing.keyword === item.keyword))
          .slice(0, remainingSlots);
        
        topKeywordsWithRank.push(...additionalItems);
      }

      // 최대 5개로 제한
      const finalKeywordsWithRank = topKeywordsWithRank.slice(0, 5);
      
      // 키워드만 추출
      const keywords = finalKeywordsWithRank.map(item => item.keyword);
      
      // rank 정보 포함한 상세 정보
      const keywordsWithRank = finalKeywordsWithRank.map(item => ({
        keyword: item.keyword,
        originalRank: item.rankPosition,
        category: item.category,
        source: item.category === 'smartblock' ? 'naver_smartblock' : 'naver_related_search',
      }));

      console.log(`🎯 추출된 상위 키워드: ${keywords.join(', ')}`);
      return { keywords, keywordsWithRank };
    } catch (error) {
      console.error('❌ DB에서 키워드 추출 실패:', error);
      return { keywords: [], keywordsWithRank: [] };
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
          topKeywords: [],
          keywordsWithRank: [],
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
          topKeywords: [],
          keywordsWithRank: [],
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
          topKeywords: [],
          keywordsWithRank: [],
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
          topKeywords: [],
          keywordsWithRank: [],
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
