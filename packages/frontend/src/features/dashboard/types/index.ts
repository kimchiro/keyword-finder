export interface KeywordStats {
  totalKeywords: number;
  keywordsByType: {
    autosuggest: number;
    togetherSearched: number;
    hotTopics: number;
  };
  recentQueries: string[];
  topKeywords: Array<{
    text: string;
    count: number;
  }>;
}

export interface KeywordData {
  id: number;
  query: string;
  keyword_type: 'autosuggest' | 'togetherSearched' | 'hotTopics';
  text: string;
  href?: string;
  imageAlt?: string;
  rank: number;
  grp: number;
  created_at: string;
}

export interface DashboardData {
  stats: KeywordStats;
  recentSearches: Array<{
    query: string;
    timestamp: string;
    totalKeywords: number;
  }>;
}

// 네이버 API 확장 타입들을 re-export
export * from '../../keyword-search/types/naver-api';

// 공유 차트 타입들을 re-export
export * from '@/shared/types';
