// 네이버 검색 API 응답 타입
export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}

export interface NaverSearchApiResponse {
  success: boolean;
  data: NaverSearchResponse;
  query: string;
  error?: string;
}

// 네이버 데이터랩 API 타입
export interface KeywordGroup {
  groupName: string;
  keywords: string[];
}

export interface DatalabDataPoint {
  period: string;
  ratio: number;
}

export interface DatalabResult {
  title: string;
  keywords: string[];
  data: DatalabDataPoint[];
}

export interface NaverDatalabResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: DatalabResult[];
}

// 확장된 네이버 데이터랩 API 타입들
export interface RelatedKeywordsResponse {
  keywordList: Array<{
    relKeyword: string;
    monthlyPcQcCnt: number;
    monthlyMobileQcCnt: number;
    monthlyAvePcClkCnt: number;
    monthlyAveMobileClkCnt: number;
    monthlyAvePcCtr: number;
    monthlyAveMobileCtr: number;
    plAvgDepth: number;
    compIdx: string;
  }>;
}

export interface NaverDatalabApiResponse {
  success: boolean;
  data: NaverDatalabResponse;
  requestParams: {
    startDate: string;
    endDate: string;
    timeUnit: string;
    keywordGroups: KeywordGroup[];
    device?: string;
    gender?: string;
    ages?: string[];
  };
  error?: string;
}

// 네이버 API 요청 옵션
export interface NaverSearchOptions {
  display?: number;
  start?: number;
  sort?: 'sim' | 'date';
}

export interface NaverDatalabOptions {
  startDate: string;
  endDate: string;
  timeUnit?: 'date' | 'week' | 'month';
  keywordGroups: KeywordGroup[];
  device?: '' | 'pc' | 'mo';
  gender?: '' | 'm' | 'f';
  ages?: string[];
}
