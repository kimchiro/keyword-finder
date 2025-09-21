import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NaverApiService } from './naver-api.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NaverApiService', () => {
  let service: NaverApiService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NaverApiService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<NaverApiService>(NaverApiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchBlogs', () => {
    it('네이버 블로그 검색 API를 성공적으로 호출해야 함', async () => {
      // Given
      const query = '맛집';
      const display = 10;
      const start = 1;
      
      mockConfigService.get
        .mockReturnValueOnce('test_client_id')
        .mockReturnValueOnce('test_client_secret');

      const mockApiResponse = {
        data: {
          total: 1000,
          start: 1,
          display: 10,
          items: [
            {
              title: '서울 <b>맛집</b> 추천',
              link: 'https://blog.naver.com/test1',
              description: '서울의 유명한 맛집들을 소개합니다.',
              bloggername: '맛집탐험가',
              bloggerlink: 'https://blog.naver.com/foodie',
              postdate: '20250921',
            },
            {
              title: '부산 <b>맛집</b> 베스트',
              link: 'https://blog.naver.com/test2',
              description: '부산 여행 시 꼭 가봐야 할 맛집들',
              bloggername: '여행러버',
              bloggerlink: 'https://blog.naver.com/traveler',
              postdate: '20250920',
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockApiResponse);

      // When
      const result = await service.searchBlogs(query, display, start);

      // Then
      expect(result.success).toBe(true);
      expect(result.data.total).toBe(1000);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.items[0].title).toContain('맛집');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://openapi.naver.com/v1/search/blog.json',
        {
          params: { query, display, start, sort: 'sim' },
          headers: {
            'X-Naver-Client-Id': 'test_client_id',
            'X-Naver-Client-Secret': 'test_client_secret',
          },
          timeout: 10000,
        },
      );
    });

    it('API 키가 없을 때 에러를 발생시켜야 함', async () => {
      // Given
      const query = '맛집';
      
      mockConfigService.get
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

      // When & Then
      await expect(service.searchBlogs(query)).rejects.toThrow(
        '네이버 API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.',
      );
    });

    it('API 호출 실패 시 에러를 발생시켜야 함', async () => {
      // Given
      const query = '맛집';
      
      mockConfigService.get
        .mockReturnValueOnce('test_client_id')
        .mockReturnValueOnce('test_client_secret');

      mockedAxios.get.mockRejectedValue(new Error('API 호출 실패'));

      // When & Then
      await expect(service.searchBlogs(query)).rejects.toThrow('API 호출 실패');
    });
  });

  describe('getDatalab', () => {
    it('네이버 데이터랩 API를 성공적으로 호출해야 함', async () => {
      // Given
      const requestBody = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        timeUnit: 'month',
        keywordGroups: [
          {
            groupName: '맛집',
            keywords: ['맛집', '맛집 추천'],
          },
        ],
      };

      mockConfigService.get
        .mockReturnValueOnce('test_client_id')
        .mockReturnValueOnce('test_client_secret');

      const mockApiResponse = {
        data: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          timeUnit: 'month',
          results: [
            {
              title: '맛집',
              keywords: ['맛집', '맛집 추천'],
              data: [
                { period: '2024-01-01', ratio: 100 },
                { period: '2024-02-01', ratio: 95 },
                { period: '2024-03-01', ratio: 110 },
              ],
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockApiResponse);

      // When
      const result = await service.getDatalab(requestBody);

      // Then
      expect(result.success).toBe(true);
      expect(result.data.results).toHaveLength(1);
      expect(result.data.results[0].title).toBe('맛집');
      expect(result.data.results[0].data).toHaveLength(3);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://openapi.naver.com/v1/datalab/search',
        requestBody,
        {
          headers: {
            'X-Naver-Client-Id': 'test_client_id',
            'X-Naver-Client-Secret': 'test_client_secret',
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );
    });
  });

  describe('getIntegratedData', () => {
    it('통합 데이터를 성공적으로 조회해야 함', async () => {
      // Given
      const query = '맛집';
      
      // Mock blog search
      jest.spyOn(service, 'searchBlogs').mockResolvedValue({
        success: true,
        data: {
          total: 1000,
          start: 1,
          display: 10,
          items: [
            {
              title: '서울 맛집 추천',
              link: 'https://blog.naver.com/test1',
              description: '서울의 유명한 맛집들을 소개합니다.',
              bloggername: '맛집탐험가',
              bloggerlink: 'https://blog.naver.com/foodie',
              postdate: '20250921',
            },
          ],
        },
      });

      // Mock datalab
      jest.spyOn(service, 'getDatalab').mockResolvedValue({
        success: true,
        data: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          timeUnit: 'month',
          results: [
            {
              title: '맛집',
              keywords: ['맛집'],
              data: [
                { period: '2024-01-01', ratio: 100 },
                { period: '2024-02-01', ratio: 95 },
              ],
            },
          ],
        },
      });

      // When
      const result = await service.getIntegratedData(query);

      // Then
      expect(result.success).toBe(true);
      expect(result.data.blogSearch).toBeDefined();
      expect(result.data.datalab).toBeDefined();
      expect(result.data.query).toBe(query);
      expect(result.data.timestamp).toBeDefined();
    });
  });
});
