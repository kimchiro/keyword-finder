// 키워드 타입 정의
export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics' | 'relatedKeywords';

// 키워드 데이터 인터페이스
export interface KeywordData {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

// 스크래핑 결과 인터페이스
export interface ScrapingResult {
  success: boolean;
  query: string;
  totalKeywords: number;
  keywords: KeywordData[];
  keywordsByType: Record<string, KeywordData[]>;
  scrapedAt: string;
  savedToDb: boolean;
  savedToFile: boolean;
  stats: {
    autosuggest: number;
    togetherSearched: number;
    hotTopics: number;
    relatedKeywords: number;
    total: number;
    duration: number;
  };
  filepath?: string;
  error?: string;
}

// 검색 폼 데이터
export interface SearchFormData {
  query: string;
}

// 검색 옵션
export interface SearchOptions {
  headless?: boolean;
  maxPagesPerModule?: number;
  saveToDb?: boolean;
}

// 검색 상태
export interface SearchState {
  loading: boolean;
  results: ScrapingResult | null;
  error: string | null;
}

// 폼 이벤트 핸들러 타입
export type SearchSubmitHandler = (query: string) => void;
export type NaverSearchHandler = (query: string) => Promise<void>;

// 컴포넌트 Props 타입
export interface SearchFormProps {
  onSubmit: SearchSubmitHandler;
  onNaverSearch?: SearchSubmitHandler;
  loading: boolean;
}

export interface SearchResultsProps {
  results: ScrapingResult;
}

// 네이버 API 관련 타입들
export interface NaverSearchApiResponse {
  data: {
    lastBuildDate: string;
    total: number;
    start: number;
    display: number;
    items: Array<{
      title: string;
      link: string;
      description: string;
      bloggername: string;
      bloggerlink: string;
      postdate: string;
    }>;
  };
}

export interface NaverDatalabApiResponse {
  data: {
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
}
