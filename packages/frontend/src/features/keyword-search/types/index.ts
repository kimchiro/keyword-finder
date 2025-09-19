// 기본 키워드 타입
export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics';

// 키워드 데이터 인터페이스
export interface KeywordData {
  text: string;
  keyword_type: KeywordType;
  rank: number;
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

// 네이버 API 관련 타입들을 re-export
export * from './naver-api';
