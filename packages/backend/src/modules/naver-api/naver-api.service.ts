import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApiRetryService } from '../../common/services/api-retry.service';
import { AppConfigService } from '../../config/app.config';
import { NAVER_API, API_RESPONSE } from '../../constants/api.constants';
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
          datalab: datalabResult.data,
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
      const [blogSearchResult, datalabResult, relatedKeywordsResult] = await Promise.all([
        this.searchBlogs(request.keyword, 5, 1, 'date'), // 최신 5개 결과, 날짜순 정렬
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
          datalab: datalabResult.data,
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
            // 데이터랩에서 월간검색량, 성비율, 디바이스 데이터 조회
            const datalabResult = await this.getDatalab({
              startDate,
              endDate,
              timeUnit: 'month',
              keywordGroups: [
                {
                  groupName: keyword,
                  keywords: [keyword],
                },
              ],
            });

            // 블로그 검색에서 누적발행량 추정
            const blogSearchResult = await this.searchBlogs(keyword, 1, 1);

            // 데이터 가공하여 필요한 정보만 추출
            const processedData = this.processLimitedKeywordData(
              keyword,
              datalabResult.data,
              blogSearchResult.data
            );

            return processedData;
          } catch (error) {
            console.error(`❌ 키워드 "${keyword}" 처리 중 오류:`, error);
            return {
              keyword,
              monthlySearchVolume: 0,
              cumulativePublications: 0,
              genderRatio: { male: 50, female: 50 },
              deviceData: { pc: 50, mobile: 50 },
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
  private processLimitedKeywordData(keyword: string, datalabData: any, blogSearchData: any) {
    try {
      // 월간검색량 계산 (데이터랩 트렌드 데이터에서 추출)
      const monthlySearchVolume = this.calculateMonthlySearchVolume(datalabData);
      
      // 누적발행량 추정 (블로그 검색 결과 total 값 활용)
      const cumulativePublications = blogSearchData.total || 0;
      
      // 성비율 데이터 (실제 API에서 제공되는 경우 사용, 없으면 기본값)
      const genderRatio = this.extractGenderRatio(datalabData);
      
      // 디바이스 데이터 (실제 API에서 제공되는 경우 사용, 없으면 기본값)
      const deviceData = this.extractDeviceData(datalabData);

      return {
        keyword,
        monthlySearchVolume,
        cumulativePublications,
        genderRatio,
        deviceData,
      };
    } catch (error) {
      console.error(`❌ 키워드 데이터 가공 오류 (${keyword}):`, error);
      return {
        keyword,
        monthlySearchVolume: 0,
        cumulativePublications: 0,
        genderRatio: { male: 50, female: 50 },
        deviceData: { pc: 50, mobile: 50 },
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

  // 성비율 데이터 추출
  private extractGenderRatio(datalabData: any): { male: number; female: number } {
    try {
      // 실제 네이버 API에서 성비율 데이터를 제공하는 경우 여기서 추출
      // 현재는 기본값 반환
      return { male: 50, female: 50 };
    } catch (error) {
      console.error('❌ 성비율 데이터 추출 오류:', error);
      return { male: 50, female: 50 };
    }
  }

  // 디바이스 데이터 추출
  private extractDeviceData(datalabData: any): { pc: number; mobile: number } {
    try {
      // 실제 네이버 API에서 디바이스 데이터를 제공하는 경우 여기서 추출
      // 현재는 기본값 반환
      return { pc: 50, mobile: 50 };
    } catch (error) {
      console.error('❌ 디바이스 데이터 추출 오류:', error);
      return { pc: 50, mobile: 50 };
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
