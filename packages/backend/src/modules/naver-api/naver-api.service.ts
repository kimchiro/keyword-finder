import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApiRetryService } from '../../common/services/api-retry.service';
import { AppConfigService } from '../../config/app.config';
import { NAVER_API, API_RESPONSE } from '../../constants/api.constants';
import { KeywordDataService } from '../keyword-analysis/domain/services/keyword-data.service';
import { Keyword, AnalysisDate } from '../keyword-analysis/domain/value-objects';
import {
  BlogSearchDto,
  DatalabTrendDto,
  IntegratedDataDto,
  SingleKeywordFullDataDto,
  MultipleKeywordsLimitedDataDto,
  BatchRequestDto,
} from './dto/naver-api.dto';

@Injectable()
export class NaverApiService {
  constructor(
    private configService: ConfigService,
    private apiRetryService: ApiRetryService,
    private appConfig: AppConfigService,
    private keywordDataService: KeywordDataService,
  ) {
    // 애플리케이션 시작 시 네이버 API 키 검증
    this.appConfig.validateNaverApiKeys();
  }

  async searchBlogs(query: string, display = 10, start = 1, sort = 'sim') {
    try {
      console.log(`🔍 네이버 블로그 검색 API 호출: ${query}`);

      // API 재시도 시스템을 사용한 호출
      const response = await this.apiRetryService.executeNaverApiWithRetry(
        () => axios.get(`${this.appConfig.naverApiBaseUrl}${NAVER_API.ENDPOINTS.BLOG_SEARCH}.json`, {
          headers: {
            [NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
            [NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
            'User-Agent': NAVER_API.HEADERS.USER_AGENT,
          },
          params: {
            query,
            display,
            start,
            sort,
          },
          timeout: this.appConfig.apiTimeoutMs,
        }),
        'blog-search'
      );

      console.log(`✅ 네이버 블로그 검색 완료: ${response.data.items?.length || 0}개 결과`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ NaverApiService.searchBlogs 오류:', error);
      throw error;
    }
  }

  async searchCafes(query: string, display = 10, start = 1, sort = 'sim') {
    try {
      console.log(`☕ 네이버 카페 검색 API 호출: ${query}`);

      // API 재시도 시스템을 사용한 호출
      const response = await this.apiRetryService.executeNaverApiWithRetry(
        () => axios.get(`${this.appConfig.naverApiBaseUrl}/v1/search/cafearticle.json`, {
          headers: {
            [NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
            [NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
            'User-Agent': NAVER_API.HEADERS.USER_AGENT,
          },
          params: {
            query,
            display,
            start,
            sort,
          },
          timeout: this.appConfig.apiTimeoutMs,
        }),
        'cafe-search'
      );

      console.log(`✅ 네이버 카페 검색 완료: ${response.data.items?.length || 0}개 결과`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ NaverApiService.searchCafes 오류:', error);
      throw error;
    }
  }

  async getDatalab(requestBody: any) {
    try {
      console.log(`📊 네이버 데이터랩 API 호출:`, requestBody);

      // API 재시도 시스템을 사용한 호출
      const response = await this.apiRetryService.executeNaverApiWithRetry(
        () => axios.post(
          `${this.appConfig.naverApiBaseUrl}${NAVER_API.ENDPOINTS.SEARCH_TREND}`,
          requestBody,
          {
            headers: {
              [NAVER_API.HEADERS.CLIENT_ID]: this.appConfig.naverClientId,
              [NAVER_API.HEADERS.CLIENT_SECRET]: this.appConfig.naverClientSecret,
              'Content-Type': NAVER_API.HEADERS.CONTENT_TYPE,
              'User-Agent': NAVER_API.HEADERS.USER_AGENT,
            },
            timeout: this.appConfig.apiExtendedTimeoutMs,
          },
        ),
        'datalab-search'
      );

      console.log(`✅ 네이버 데이터랩 조회 완료: ${response.data.results?.length || 0}개 결과`);
      
      // 🔍 DEBUG: 실제 API 응답 구조 확인
      console.log('📊 네이버 데이터랩 API 전체 응답:', JSON.stringify(response.data, null, 2));
      
      // 성별/디바이스 데이터가 있는지 확인
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        console.log('🔍 첫 번째 결과 구조:', JSON.stringify(firstResult, null, 2));
        
        // 성별 데이터 확인
        if (firstResult.gender || firstResult.genderRatio || firstResult.demographics) {
          console.log('👥 성별 데이터 발견:', firstResult.gender || firstResult.genderRatio || firstResult.demographics);
        }
        
        // 디바이스 데이터 확인
        if (firstResult.device || firstResult.deviceRatio || firstResult.platform) {
          console.log('📱 디바이스 데이터 발견:', firstResult.device || firstResult.deviceRatio || firstResult.platform);
        }
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ NaverApiService.getDatalab 오류:', error);
      throw error;
    }
  }


  async getIntegratedData(query: string) {
    try {
      console.log(`🔄 통합 데이터 조회 시작: ${query}`);

      // 블로그 검색과 데이터랩 트렌드를 병렬로 조회
      const [blogSearchResult, datalabResult] = await Promise.all([
        this.searchBlogs(query, 1, 1),
        // 📊 전체 데이터만 조회 (성별/디바이스 데이터 제외)
        this.getDatalab({
          startDate: this.appConfig.defaultStartDate,
          endDate: this.appConfig.defaultEndDate,
          timeUnit: 'month',
          keywordGroups: [
            {
              groupName: query,
              keywords: [query],
            },
          ],
        }),
      ]);

      console.log(`✅ 통합 데이터 조회 완료: ${query}`);

      return {
        success: true,
        data: {
          query,
          blogSearch: blogSearchResult.data,
          datalab: datalabResult.data, // 전체 데이터만
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ NaverApiService.getIntegratedData 오류:', error);
      throw error;
    }
  }

  // 1번째 요청: 단일 키워드의 모든 데이터 조회
  async getSingleKeywordFullData(request: SingleKeywordFullDataDto) {
    try {
      console.log(`🔍 단일 키워드 전체 데이터 조회 시작: ${request.keyword}`);

      // 날짜 설정: 작년 어제부터 어제까지
      const { startDate, endDate } = this.getDateRange();
      console.log(`📅 검색 기간: ${startDate} ~ ${endDate}`);

      // 블로그 검색, 데이터랩 트렌드, 연관 검색어를 병렬로 조회
      const [blogSearchResult, generalDatalabResult, relatedKeywordsResult] = await Promise.all([
        this.searchBlogs(request.keyword, 5, 1, 'date'), // 최신 5개 결과, 날짜순 정렬
        // 전체 트렌드 데이터
        this.getDatalab({
          startDate,
          endDate,
          timeUnit: 'month',
          keywordGroups: [
            {
              groupName: request.keyword,
              keywords: [request.keyword],
            },
          ],
        }),
        // 연관 검색어 조회 (추가 API 호출)
        this.getRelatedKeywords(request.keyword),
      ]);

      console.log(`✅ 단일 키워드 전체 데이터 조회 완료: ${request.keyword}`);

      return {
        success: true,
        data: {
          keyword: request.keyword,
          blogSearch: blogSearchResult.data,
          datalab: generalDatalabResult.data,
          relatedKeywords: relatedKeywordsResult.data,
          searchPeriod: { startDate, endDate },
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ NaverApiService.getSingleKeywordFullData 오류:', error);
      throw error;
    }
  }

  // 2번째, 3번째 요청: 다중 키워드의 제한된 데이터 조회
  async getMultipleKeywordsLimitedData(request: MultipleKeywordsLimitedDataDto) {
    try {
      console.log(`📊 다중 키워드 제한 데이터 조회 시작: ${request.keywords.join(', ')}`);

      if (request.keywords.length > 5) {
        throw new Error('키워드는 최대 5개까지만 요청할 수 있습니다.');
      }

      const startDate = request.startDate || this.appConfig.defaultStartDate;
      const endDate = request.endDate || this.appConfig.defaultEndDate;

      // 각 키워드별로 제한된 데이터만 조회
      const keywordResults = await Promise.all(
        request.keywords.map(async (keyword) => {
          try {
            // 전체 데이터와 블로그 검색을 병렬로 조회
            const [generalResult, blogSearchResult] = await Promise.all([
              // 전체 트렌드 데이터
              this.getDatalab({
                startDate,
                endDate,
                timeUnit: 'month',
                keywordGroups: [
                  {
                    groupName: keyword,
                    keywords: [keyword],
                  },
                ],
              }),
              // 블로그 검색에서 누적발행량 추정
              this.searchBlogs(keyword, 1, 1),
            ]);

            // 데이터 가공하여 필요한 정보만 추출
            const processedData = this.processLimitedKeywordData(
              keyword,
              generalResult.data,
              blogSearchResult.data
            );

            return processedData;
          } catch (error) {
            console.error(`❌ 키워드 "${keyword}" 처리 중 오류:`, error);
            return {
              keyword,
              monthlySearchVolume: 0,
              cumulativePublications: 0,
              error: error.message,
            };
          }
        })
      );

      console.log(`✅ 다중 키워드 제한 데이터 조회 완료: ${request.keywords.length}개 키워드`);

      return {
        success: true,
        data: {
          keywords: request.keywords,
          results: keywordResults,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ NaverApiService.getMultipleKeywordsLimitedData 오류:', error);
      throw error;
    }
  }

  // 배치 요청 처리
  async processBatchRequest(request: BatchRequestDto) {
    try {
      console.log('🚀 배치 요청 처리 시작');
      const startTime = Date.now();

      // 3개의 요청을 순차적으로 처리 (API 제한을 고려)
      const [firstResult, secondResult, thirdResult] = await Promise.all([
        this.getSingleKeywordFullData(request.firstRequest),
        this.getMultipleKeywordsLimitedData(request.secondRequest),
        this.getMultipleKeywordsLimitedData(request.thirdRequest),
      ]);

      const endTime = Date.now();
      const totalProcessingTime = endTime - startTime;

      console.log(`✅ 배치 요청 처리 완료 (${totalProcessingTime}ms)`);

      return {
        success: true,
        data: {
          firstResult: firstResult.data,
          secondResult: secondResult.data,
          thirdResult: thirdResult.data,
          totalProcessingTime,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ NaverApiService.processBatchRequest 오류:', error);
      throw error;
    }
  }

  // 연관 검색어 조회 (가상의 메서드 - 실제 네이버 API에 따라 구현)
  private async getRelatedKeywords(keyword: string) {
    try {
      // 실제로는 네이버 연관검색어 API를 호출해야 함
      // 현재는 데이터랩 API를 활용하여 유사한 기능 구현
      console.log(`🔗 연관 검색어 조회: ${keyword}`);
      
      return {
        success: true,
        data: {
          keyword,
          relatedKeywords: [], // 실제 API 응답에 따라 구현
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ 연관 검색어 조회 오류:', error);
      return {
        success: false,
        data: {
          keyword,
          relatedKeywords: [],
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // 제한된 키워드 데이터 가공
  private processLimitedKeywordData(
    keyword: string, 
    generalData: any, 
    blogSearchData: any
  ) {
    try {
      // 월간검색량 계산 (데이터랩 트렌드 데이터에서 추출)
      const monthlySearchVolume = this.calculateMonthlySearchVolume(generalData);
      
      // 누적발행량 추정 (블로그 검색 결과 total 값 활용)
      const cumulativePublications = blogSearchData.total || 0;

      console.log(`📊 키워드 "${keyword}" 데이터 가공 완료:`, {
        monthlySearchVolume,
        cumulativePublications,
      });

      return {
        keyword,
        monthlySearchVolume,
        cumulativePublications,
      };
    } catch (error) {
      console.error(`❌ 키워드 데이터 가공 오류 (${keyword}):`, error);
      return {
        keyword,
        monthlySearchVolume: 0,
        cumulativePublications: 0,
      };
    }
  }

  // 월간검색량 계산
  private calculateMonthlySearchVolume(datalabData: any): number {
    try {
      if (datalabData.results && datalabData.results.length > 0) {
        const latestData = datalabData.results[0].data;
        if (latestData && latestData.length > 0) {
          // 최근 데이터의 ratio 값을 기반으로 추정
          return latestData[latestData.length - 1].ratio * 100; // 임시 계산식
        }
      }
      return 0;
    } catch (error) {
      console.error('❌ 월간검색량 계산 오류:', error);
      return 0;
    }
  }






  // 블로그와 카페 검색 결과 수 조회
  async getContentCounts(query: string) {
    try {
      console.log(`📊 키워드 "${query}" 콘텐츠 수 조회 시작`);

      // 블로그와 카페 검색을 병렬로 실행 (결과 수만 필요하므로 display=1)
      const [blogResult, cafeResult] = await Promise.all([
        this.searchBlogs(query, 1, 1),
        this.searchCafes(query, 1, 1),
      ]);

      const contentCounts = {
        keyword: query,
        searchedAt: new Date(),
        counts: {
          blogs: blogResult.data.total || 0,      // 블로그 글 수
          cafes: cafeResult.data.total || 0,      // 카페 글 수
          total: (blogResult.data.total || 0) + (cafeResult.data.total || 0), // 전체 합계
        }
      };

      console.log(`✅ 콘텐츠 수 조회 완료:`, contentCounts.counts);
      return { success: true, data: contentCounts };

    } catch (error) {
      console.error('❌ NaverApiService.getContentCounts 오류:', error);
      throw error;
    }
  }

  // 콘텐츠 수 조회 및 데이터베이스 저장
  async getContentCountsAndSave(query: string) {
    try {
      console.log(`💾 키워드 "${query}" 콘텐츠 수 조회 및 저장 시작`);

      // 콘텐츠 수 조회
      const contentResult = await this.getContentCounts(query);
      
      // Value Objects 생성
      const keyword = new Keyword(query);
      const analysisDate = new AnalysisDate(); // 오늘 날짜로 생성
      
      // 데이터베이스에 저장
      const savedAnalytics = await this.keywordDataService.saveContentCounts(
        keyword,
        analysisDate,
        {
          blogs: contentResult.data.counts.blogs,
          cafes: contentResult.data.counts.cafes,
          total: contentResult.data.counts.total,
        }
      );

      console.log(`✅ 콘텐츠 수 데이터 저장 완료: ${query}`, {
        id: savedAnalytics.id,
        blogs: savedAnalytics.monthlyContentBlog,
        cafes: savedAnalytics.monthlyContentCafe,
        total: savedAnalytics.monthlyContentAll,
      });
      
      return { 
        success: true, 
        data: {
          keyword: query,
          searchedAt: contentResult.data.searchedAt,
          counts: contentResult.data.counts,
          savedToDatabase: {
            id: savedAnalytics.id,
            analysisDate: savedAnalytics.analysisDate,
            monthlyContentBlog: savedAnalytics.monthlyContentBlog,
            monthlyContentCafe: savedAnalytics.monthlyContentCafe,
            monthlyContentAll: savedAnalytics.monthlyContentAll,
          }
        },
        message: `키워드 "${query}" 콘텐츠 수 조회 및 데이터베이스 저장이 완료되었습니다.`
      };

    } catch (error) {
      console.error('❌ NaverApiService.getContentCountsAndSave 오류:', error);
      throw error;
    }
  }



  // 날짜 범위 계산: 작년 어제부터 어제까지
  private getDateRange(): { startDate: string; endDate: string } {
    const today = new Date();
    
    // 어제 날짜 계산
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // 작년 어제 날짜 계산
    const lastYearYesterday = new Date(yesterday);
    lastYearYesterday.setFullYear(yesterday.getFullYear() - 1);
    
    // YYYY-MM-DD 형식으로 변환
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const startDate = formatDate(lastYearYesterday);
    const endDate = formatDate(yesterday);
    
    return { startDate, endDate };
  }
}
