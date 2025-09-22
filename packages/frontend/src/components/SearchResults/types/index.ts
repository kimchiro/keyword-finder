import { ScrapingData } from '@/commons/types/workflow';

// 키워드 데이터 타입 (백엔드 스크래핑 결과)
export interface KeywordData {
  keyword: string;
  category: string;
  score?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

// SearchResults 컴포넌트 Props 타입
export interface SearchResultsProps {
  scrapingData: ScrapingData | null;
}
