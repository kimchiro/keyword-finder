// 네이버 검색 아이템 타입
export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

// 네이버 검색 API 응답 타입
export interface NaverSearchApiResponse {
  success: boolean;
  data?: {
    items?: NaverSearchItem[];
    total?: number;
    start?: number;
    display?: number;
  };
  error?: string;
}

// 네이버 데이터랩 API 응답 타입
export interface NaverDatalabApiResponse {
  success: boolean;
  data?: {
    startDate: string;
    endDate: string;
    timeUnit: string;
    results: Array<{
      title: string;
      keywords: string[];
      data: Array<{
        period: string;
        ratio: number;
      }>;
    }>;
  };
  error?: string;
}

// 네이버 검색 옵션
export interface NaverSearchOptions {
  display?: number;
  start?: number;
  sort?: 'sim' | 'date';
}

// 네이버 데이터랩 옵션
export interface NaverDatalabOptions {
  startDate: string;
  endDate: string;
  timeUnit: 'date' | 'week' | 'month';
  keywordGroups: Array<{
    groupName: string;
    keywords: string[];
  }>;
}

// 네이버 검색 상태 타입
export interface NaverSearchState {
  loading: boolean;
  searchResults: NaverSearchApiResponse | null;
  datalabResults: NaverDatalabApiResponse | null;
  error: string | null;
}

// 백엔드에서 반환하는 네이버 블로그 검색 결과 타입
export interface NaverBlogSearchResult {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}

// 백엔드에서 반환하는 네이버 데이터랩 결과 타입
export interface NaverDatalabResult {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: Array<{
    title: string;
    keywords: string[];
    data: Array<{
      period: string;
      ratio: number;
    }>;
  }>;
}
