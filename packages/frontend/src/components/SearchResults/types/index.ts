// 키워드 데이터 타입
export interface KeywordData {
  text: string;
  rank: number;
  keyword_type: string;
}

// 검색 결과 통계 타입
export interface SearchStats {
  total: number;
  duration: number;
}

// 검색 결과 타입
export interface SearchResultsData {
  success: boolean;
  keywords?: KeywordData[];
  totalKeywords?: number;
  stats?: SearchStats;
}

// SearchResults 컴포넌트 Props 타입
export interface SearchResultsProps {
  results: SearchResultsData;
}
