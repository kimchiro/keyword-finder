import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  BlogSearchDto,
  DatalabTrendDto,
  IntegratedDataDto,
} from './dto/naver-api.dto';

@Injectable()
export class NaverApiService {
  private readonly naverClientId: string;
  private readonly naverClientSecret: string;

  constructor(private configService: ConfigService) {
    this.naverClientId = this.configService.get('NAVER_CLIENT_ID');
    this.naverClientSecret = this.configService.get('NAVER_CLIENT_SECRET');
  }

  async searchBlogs(query: string, display = 10, start = 1, sort = 'sim') {
    try {
      // 네이버 API 키 검증
      if (!this.naverClientId || !this.naverClientSecret) {
        throw new Error('네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      }

      console.log(`🔍 네이버 블로그 검색 API 호출: ${query}`);

      const response = await axios.get('https://openapi.naver.com/v1/search/blog.json', {
        headers: {
          'X-Naver-Client-Id': this.naverClientId,
          'X-Naver-Client-Secret': this.naverClientSecret,
        },
        params: {
          query,
          display,
          start,
          sort,
        },
        timeout: 10000,
      });

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
      // 네이버 API 키 검증
      if (!this.naverClientId || !this.naverClientSecret) {
        throw new Error('네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      }

      console.log(`📊 네이버 데이터랩 API 호출:`, requestBody);

      const response = await axios.post(
        'https://openapi.naver.com/v1/datalab/search',
        requestBody,
        {
          headers: {
            'X-Naver-Client-Id': this.naverClientId,
            'X-Naver-Client-Secret': this.naverClientSecret,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
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
        this.searchBlogs(query, 20, 1),
        this.getDatalab({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
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
}
