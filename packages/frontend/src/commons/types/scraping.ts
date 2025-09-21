// 스크래핑 옵션 타입
export interface ScrapingOptions {
  headless?: boolean;
  maxPagesPerModule?: number;
  saveToDb?: boolean;
}

// 키워드 데이터 타입
export interface KeywordData {
  text: string;
  rank: number;
  keyword_type: string;
}

// 스크래핑 결과 타입
export interface ScrapingResult {
  success: boolean;
  keywords?: KeywordData[];
  totalKeywords?: number;
  stats?: {
    total: number;
    duration: number;
  };
  error?: string;
}

// 스크래핑 상태 타입
export interface ScrapingState {
  loading: boolean;
  results: ScrapingResult | null;
  error: string | null;
}
