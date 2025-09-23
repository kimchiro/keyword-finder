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

      // 블로그 검색, 데이터랩 트렌드(전체/성별/디바이스/연령), 연관 검색어를 병렬로 조회
      const [blogSearchResult, generalDatalabResult, genderDatalabResult, deviceDatalabResult, ageDatalabResult, relatedKeywordsResult] = await Promise.all([
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
        // 성별 데이터
        this.getDatalab({
          startDate,
          endDate,
          timeUnit: 'month',
          category: 'gender',
          keywordGroups: [
            {
              groupName: request.keyword,
              keywords: [request.keyword],
            },
          ],
        }),
        // 디바이스 데이터
        this.getDatalab({
          startDate,
          endDate,
          timeUnit: 'month',
          category: 'device',
          keywordGroups: [
            {
              groupName: request.keyword,
              keywords: [request.keyword],
            },
          ],
        }),
        // 연령 데이터
        this.getDatalab({
          startDate,
          endDate,
          timeUnit: 'month',
          category: 'age',
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
          datalab: {
            general: generalDatalabResult.data,
            gender: genderDatalabResult.data,
            device: deviceDatalabResult.data,
            age: ageDatalabResult.data,
          },
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
            // 전체, 성별, 디바이스, 연령 데이터를 병렬로 조회
            const [generalResult, genderResult, deviceResult, ageResult, blogSearchResult] = await Promise.all([
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
              // 성별 데이터
              this.getDatalab({
                startDate,
                endDate,
                timeUnit: 'month',
                category: 'gender',
                keywordGroups: [
                  {
                    groupName: keyword,
                    keywords: [keyword],
                  },
                ],
              }),
              // 디바이스 데이터
              this.getDatalab({
                startDate,
                endDate,
                timeUnit: 'month',
                category: 'device',
                keywordGroups: [
                  {
                    groupName: keyword,
                    keywords: [keyword],
                  },
                ],
              }),
              // 연령 데이터
              this.getDatalab({
                startDate,
                endDate,
                timeUnit: 'month',
                category: 'age',
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
              blogSearchResult.data,
              genderResult.data,
              deviceResult.data,
              ageResult.data
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
              ageData: { '10s': 16.7, '20s': 16.7, '30s': 16.7, '40s': 16.7, '50s': 16.7, '60+': 16.5 },
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
    blogSearchData: any, 
    genderData?: any, 
    deviceData?: any,
    ageData?: any
  ) {
    try {
      // 월간검색량 계산 (데이터랩 트렌드 데이터에서 추출)
      const monthlySearchVolume = this.calculateMonthlySearchVolume(generalData);
      
      // 누적발행량 추정 (블로그 검색 결과 total 값 활용)
      const cumulativePublications = blogSearchData.total || 0;
      
      // 성비율 데이터 (category='gender'로 조회한 데이터 사용)
      const genderRatio = this.extractGenderRatioFromCategoryData(genderData);
      
      // 디바이스 데이터 (category='device'로 조회한 데이터 사용)
      const deviceRatio = this.extractDeviceDataFromCategoryData(deviceData);

      // 연령 데이터 (category='age'로 조회한 데이터 사용)
      const ageRatio = this.extractAgeDataFromCategoryData(ageData);

      console.log(`📊 키워드 "${keyword}" 데이터 가공 완료:`, {
        monthlySearchVolume,
        cumulativePublications,
        genderRatio,
        deviceRatio,
        ageRatio,
      });

      return {
        keyword,
        monthlySearchVolume,
        cumulativePublications,
        genderRatio,
        deviceData: deviceRatio,
        ageData: ageRatio,
      };
    } catch (error) {
      console.error(`❌ 키워드 데이터 가공 오류 (${keyword}):`, error);
      return {
        keyword,
        monthlySearchVolume: 0,
        cumulativePublications: 0,
        genderRatio: { male: 50, female: 50 },
        deviceData: { pc: 50, mobile: 50 },
        ageData: { '10s': 16.7, '20s': 16.7, '30s': 16.7, '40s': 16.7, '50s': 16.7, '60+': 16.5 },
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

  // 성비율 데이터 추출 (1년치 평균 계산)
  private extractGenderRatio(naverApiData: any): { male: number; female: number } {
    try {
      // 네이버 API에서 성별 데이터 추출
      if (naverApiData?.genderData) {
        const maleData = naverApiData.genderData.male;
        const femaleData = naverApiData.genderData.female;
        
        if (maleData?.results?.[0]?.data && femaleData?.results?.[0]?.data) {
          // 1년치 데이터의 평균 계산
          const maleRatios = maleData.results[0].data.map(item => item.ratio || 0);
          const femaleRatios = femaleData.results[0].data.map(item => item.ratio || 0);
          
          const maleAverage = maleRatios.reduce((sum, ratio) => sum + ratio, 0) / maleRatios.length;
          const femaleAverage = femaleRatios.reduce((sum, ratio) => sum + ratio, 0) / femaleRatios.length;
          
          const total = maleAverage + femaleAverage;
          if (total > 0) {
            const malePercentage = (maleAverage / total) * 100;
            const femalePercentage = (femaleAverage / total) * 100;
            
            console.log(`📊 성별 비율 (1년 평균): 남성 ${malePercentage.toFixed(1)}%, 여성 ${femalePercentage.toFixed(1)}%`);
            
            return {
              male: Math.round(malePercentage * 10) / 10, // 소수점 1자리
              female: Math.round(femalePercentage * 10) / 10,
            };
          }
        }
      }
      
      console.log('⚠️ 성별 데이터를 찾을 수 없어 기본값 사용');
      return { male: 50.0, female: 50.0 };
    } catch (error) {
      console.error('❌ 성비율 데이터 추출 오류:', error);
      return { male: 50.0, female: 50.0 };
    }
  }

  // 디바이스 데이터 추출 (1년치 평균 계산)
  private extractDeviceData(naverApiData: any): { pc: number; mobile: number } {
    try {
      // 네이버 API에서 디바이스 데이터 추출
      if (naverApiData?.deviceData) {
        const pcData = naverApiData.deviceData.pc;
        const mobileData = naverApiData.deviceData.mobile;
        
        if (pcData?.results?.[0]?.data && mobileData?.results?.[0]?.data) {
          // 1년치 데이터의 평균 계산
          const pcRatios = pcData.results[0].data.map(item => item.ratio || 0);
          const mobileRatios = mobileData.results[0].data.map(item => item.ratio || 0);
          
          const pcAverage = pcRatios.reduce((sum, ratio) => sum + ratio, 0) / pcRatios.length;
          const mobileAverage = mobileRatios.reduce((sum, ratio) => sum + ratio, 0) / mobileRatios.length;
          
          const total = pcAverage + mobileAverage;
          if (total > 0) {
            const pcPercentage = (pcAverage / total) * 100;
            const mobilePercentage = (mobileAverage / total) * 100;
            
            console.log(`💻 디바이스 비율 (1년 평균): PC ${pcPercentage.toFixed(1)}%, 모바일 ${mobilePercentage.toFixed(1)}%`);
            
            return {
              pc: Math.round(pcPercentage * 10) / 10, // 소수점 1자리
              mobile: Math.round(mobilePercentage * 10) / 10,
            };
          }
        }
      }
      
      console.log('⚠️ 디바이스 데이터를 찾을 수 없어 기본값 사용');
      return { pc: 50.0, mobile: 50.0 };
    } catch (error) {
      console.error('❌ 디바이스 데이터 추출 오류:', error);
      return { pc: 50.0, mobile: 50.0 };
    }
  }

  // category='gender'로 조회한 성별 데이터 추출
  private extractGenderRatioFromCategoryData(genderData: any): { male: number; female: number } {
    try {
      console.log('🔍 성별 카테고리 데이터 분석:', JSON.stringify(genderData, null, 2));
      
      if (genderData?.results && genderData.results.length >= 2) {
        // 네이버 데이터랩 category='gender' 응답에서는 results 배열에 남성/여성 데이터가 분리되어 옴
        const results = genderData.results;
        
        // 각 결과의 title로 남성/여성 구분 (또는 순서로 구분)
        let maleData = null;
        let femaleData = null;
        
        for (const result of results) {
          if (result.title?.includes('남') || result.title?.includes('male') || result.title?.includes('M')) {
            maleData = result;
          } else if (result.title?.includes('여') || result.title?.includes('female') || result.title?.includes('F')) {
            femaleData = result;
          }
        }
        
        // title로 구분이 안되면 순서로 구분 (보통 첫 번째가 남성, 두 번째가 여성)
        if (!maleData && !femaleData && results.length >= 2) {
          maleData = results[0];
          femaleData = results[1];
        }
        
        if (maleData?.data && femaleData?.data) {
          // 1년치 데이터의 평균 계산
          const maleRatios = maleData.data.map(item => item.ratio || 0);
          const femaleRatios = femaleData.data.map(item => item.ratio || 0);
          
          const maleAverage = maleRatios.reduce((sum, ratio) => sum + ratio, 0) / maleRatios.length;
          const femaleAverage = femaleRatios.reduce((sum, ratio) => sum + ratio, 0) / femaleRatios.length;
          
          const total = maleAverage + femaleAverage;
          if (total > 0) {
            const malePercentage = (maleAverage / total) * 100;
            const femalePercentage = (femaleAverage / total) * 100;
            
            console.log(`👥 성별 비율 (카테고리 데이터): 남성 ${malePercentage.toFixed(1)}%, 여성 ${femalePercentage.toFixed(1)}%`);
            
            return {
              male: Math.round(malePercentage * 10) / 10,
              female: Math.round(femalePercentage * 10) / 10,
            };
          }
        }
      }
      
      console.log('⚠️ 성별 카테고리 데이터를 찾을 수 없어 기본값 사용');
      return { male: 50.0, female: 50.0 };
    } catch (error) {
      console.error('❌ 성별 카테고리 데이터 추출 오류:', error);
      return { male: 50.0, female: 50.0 };
    }
  }

  // category='device'로 조회한 디바이스 데이터 추출
  private extractDeviceDataFromCategoryData(deviceData: any): { pc: number; mobile: number } {
    try {
      console.log('🔍 디바이스 카테고리 데이터 분석:', JSON.stringify(deviceData, null, 2));
      
      if (deviceData?.results && deviceData.results.length >= 2) {
        // 네이버 데이터랩 category='device' 응답에서는 results 배열에 PC/모바일 데이터가 분리되어 옴
        const results = deviceData.results;
        
        // 각 결과의 title로 PC/모바일 구분
        let pcData = null;
        let mobileData = null;
        
        for (const result of results) {
          if (result.title?.includes('PC') || result.title?.includes('pc') || result.title?.includes('데스크')) {
            pcData = result;
          } else if (result.title?.includes('모바일') || result.title?.includes('mobile') || result.title?.includes('Mobile')) {
            mobileData = result;
          }
        }
        
        // title로 구분이 안되면 순서로 구분 (보통 첫 번째가 PC, 두 번째가 모바일)
        if (!pcData && !mobileData && results.length >= 2) {
          pcData = results[0];
          mobileData = results[1];
        }
        
        if (pcData?.data && mobileData?.data) {
          // 1년치 데이터의 평균 계산
          const pcRatios = pcData.data.map(item => item.ratio || 0);
          const mobileRatios = mobileData.data.map(item => item.ratio || 0);
          
          const pcAverage = pcRatios.reduce((sum, ratio) => sum + ratio, 0) / pcRatios.length;
          const mobileAverage = mobileRatios.reduce((sum, ratio) => sum + ratio, 0) / mobileRatios.length;
          
          const total = pcAverage + mobileAverage;
          if (total > 0) {
            const pcPercentage = (pcAverage / total) * 100;
            const mobilePercentage = (mobileAverage / total) * 100;
            
            console.log(`💻 디바이스 비율 (카테고리 데이터): PC ${pcPercentage.toFixed(1)}%, 모바일 ${mobilePercentage.toFixed(1)}%`);
            
            return {
              pc: Math.round(pcPercentage * 10) / 10,
              mobile: Math.round(mobilePercentage * 10) / 10,
            };
          }
        }
      }
      
      console.log('⚠️ 디바이스 카테고리 데이터를 찾을 수 없어 기본값 사용');
      return { pc: 50.0, mobile: 50.0 };
    } catch (error) {
      console.error('❌ 디바이스 카테고리 데이터 추출 오류:', error);
      return { pc: 50.0, mobile: 50.0 };
    }
  }

  // category='age'로 조회한 연령 데이터 추출
  private extractAgeDataFromCategoryData(ageData: any): { '10s': number; '20s': number; '30s': number; '40s': number; '50s': number; '60+': number } {
    try {
      console.log('🔍 연령 카테고리 데이터 분석:', JSON.stringify(ageData, null, 2));
      
      if (ageData?.results && ageData.results.length > 0) {
        // 네이버 데이터랩 category='age' 응답에서는 results 배열에 연령대별 데이터가 분리되어 옴
        const results = ageData.results;
        
        // 연령대별 데이터 매핑
        const ageGroups = {
          '10s': null,
          '20s': null,
          '30s': null,
          '40s': null,
          '50s': null,
          '60+': null,
        };
        
        // 각 결과의 title로 연령대 구분
        for (const result of results) {
          const title = result.title?.toLowerCase() || '';
          
          if (title.includes('10') || title.includes('십대') || title.includes('10대')) {
            ageGroups['10s'] = result;
          } else if (title.includes('20') || title.includes('이십대') || title.includes('20대')) {
            ageGroups['20s'] = result;
          } else if (title.includes('30') || title.includes('삼십대') || title.includes('30대')) {
            ageGroups['30s'] = result;
          } else if (title.includes('40') || title.includes('사십대') || title.includes('40대')) {
            ageGroups['40s'] = result;
          } else if (title.includes('50') || title.includes('오십대') || title.includes('50대')) {
            ageGroups['50s'] = result;
          } else if (title.includes('60') || title.includes('육십대') || title.includes('60대') || title.includes('60+') || title.includes('이상')) {
            ageGroups['60+'] = result;
          }
        }
        
        // title로 구분이 안되면 순서로 구분 (보통 10대부터 60대 이상 순서)
        if (Object.values(ageGroups).every(group => group === null) && results.length >= 6) {
          ageGroups['10s'] = results[0];
          ageGroups['20s'] = results[1];
          ageGroups['30s'] = results[2];
          ageGroups['40s'] = results[3];
          ageGroups['50s'] = results[4];
          ageGroups['60+'] = results[5];
        }
        
        // 각 연령대별 평균 비율 계산
        const ageRatios: Record<string, number> = {};
        let totalRatio = 0;
        
        for (const [ageGroup, data] of Object.entries(ageGroups)) {
          if (data?.data && data.data.length > 0) {
            const ratios = data.data.map((item: any) => item.ratio || 0);
            const average = ratios.reduce((sum: number, ratio: number) => sum + ratio, 0) / ratios.length;
            ageRatios[ageGroup] = average;
            totalRatio += average;
          } else {
            ageRatios[ageGroup] = 0;
          }
        }
        
        // 비율을 백분율로 변환
        if (totalRatio > 0) {
          const result: Record<string, number> = {};
          for (const [ageGroup, ratio] of Object.entries(ageRatios)) {
            const percentage = (ratio / totalRatio) * 100;
            result[ageGroup] = Math.round(percentage * 10) / 10; // 소수점 1자리
          }
          
          console.log(`👶 연령 비율 (카테고리 데이터):`, result);
          return result as { '10s': number; '20s': number; '30s': number; '40s': number; '50s': number; '60+': number };
        }
      }
      
      console.log('⚠️ 연령 카테고리 데이터를 찾을 수 없어 기본값 사용');
      return { '10s': 16.7, '20s': 16.7, '30s': 16.7, '40s': 16.7, '50s': 16.7, '60+': 16.5 };
    } catch (error) {
      console.error('❌ 연령 카테고리 데이터 추출 오류:', error);
      return { '10s': 16.7, '20s': 16.7, '30s': 16.7, '40s': 16.7, '50s': 16.7, '60+': 16.5 };
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
