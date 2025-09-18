// 키워드 타입 정의
export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics';

// 키워드 데이터 인터페이스
export interface KeywordData {
  id?: number;
  query: string;
  keyword_type: KeywordType;
  text: string;
  href?: string;
  imageAlt?: string;
  rank: number;
  grp: number;
  created_at?: string;
}

// 스크래핑 옵션 인터페이스
export interface ScrapingOptions {
  headless: boolean;
  maxPagesPerModule: number;
  waitTimeoutMs: number;
  sleepMinMs: number;
  sleepMaxMs: number;
  outputDir: string;
}

// 스크래핑 결과 인터페이스
export interface ScrapingResult {
  success: boolean;
  data: KeywordData[];
  stats: {
    autosuggest: number;
    togetherSearched: number;
    hotTopics: number;
    total: number;
    duration: number;
  };
  error?: string;
  outputFile?: string;
}

// API 응답 인터페이스
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 키워드 검색 요청 인터페이스
export interface KeywordSearchRequest {
  query: string;
  options?: Partial<ScrapingOptions>;
}

// 키워드 통계 인터페이스
export interface KeywordStats {
  totalKeywords: number;
  keywordsByType: Record<KeywordType, number>;
  recentQueries: string[];
  topKeywords: Array<{
    text: string;
    count: number;
  }>;
}
