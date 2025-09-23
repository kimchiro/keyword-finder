import axios from 'axios';

// 네이버 검색 옵션 타입
export interface NaverSearchOptions {
  display?: number;
  start?: number;
  sort?: 'sim' | 'date';
}

// 네이버 데이터랩 옵션 타입
export interface NaverDatalabOptions {
  startDate: string;
  endDate: string;
  timeUnit: 'date' | 'week' | 'month';
  keywordGroups: Array<{
    groupName: string;
    keywords: string[];
  }>;
}

// 네이버 블로그 검색 API
export const searchNaverBlogs = async (query: string, options: NaverSearchOptions = {}) => {
  const { display = 10, start = 1, sort = 'sim' } = options;
  
  try {
    const response = await axios.get('/api/naver/blog-search', {
      params: {
        query,
        display,
        start,
        sort
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ [네이버 블로그 검색] API 오류:', error);
    throw error;
  }
};

// 네이버 데이터랩 트렌드 API
export const getNaverTrend = async (options: NaverDatalabOptions) => {
  try {
    const response = await axios.post('/api/naver/datalab', options);
    return response.data;
  } catch (error) {
    console.error('❌ [네이버 데이터랩] API 오류:', error);
    throw error;
  }
};

// 통합 데이터 조회 API
export const getIntegratedKeywordData = async (query: string) => {
  try {
    const response = await axios.get(`/api/naver/integrated-data/${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('❌ [통합 데이터] API 오류:', error);
    throw error;
  }
};

// 키워드 스크래핑 API
export const scrapeKeywords = async (query: string, options: {
  headless?: boolean;
  maxPagesPerModule?: number;
  saveToDb?: boolean;
} = {}) => {
  try {
    const response = await axios.post('/api/scraping/keywords', {
      query,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error('❌ [키워드 스크래핑] API 오류:', error);
    throw error;
  }
};
