// commons/types에서 필요한 타입들을 import 및 re-export
import type {
  ScrapingOptions,
  KeywordData,
  ScrapingResult,
  ScrapingState,
  NaverSearchItem,
  NaverSearchApiResponse,
  NaverDatalabApiResponse,
  NaverSearchOptions,
  NaverDatalabOptions,
  NaverSearchState,
  ScrapedKeyword,
  KeywordTrendAnalysis,
  RankingComparison,
  CategoryStats,
  TimeSeriesData,
  IntegratedData,
  EnhancedIntegratedData,
  KeywordAnalysisState
} from '@/commons/types';

export type {
  ScrapingOptions,
  KeywordData,
  ScrapingResult,
  ScrapingState,
  NaverSearchItem,
  NaverSearchApiResponse,
  NaverDatalabApiResponse,
  NaverSearchOptions,
  NaverDatalabOptions,
  NaverSearchState,
  ScrapedKeyword,
  KeywordTrendAnalysis,
  RankingComparison,
  CategoryStats,
  TimeSeriesData,
  IntegratedData,
  EnhancedIntegratedData,
  KeywordAnalysisState
};

// 컴포넌트 전용 타입들
export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics' | 'relatedKeywords';

// 검색 폼 데이터
export interface SearchFormData {
  query: string;
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