import { TrendType, SortType, SortOrder } from '@/commons/enums';

// 스크래핑된 키워드 기본 타입
export interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

// 트렌드 분석 결과 타입
export interface TrendAnalysis {
  rising: ScrapedKeyword[];
  falling: ScrapedKeyword[];
  stable: ScrapedKeyword[];
  new: ScrapedKeyword[];
  disappeared: ScrapedKeyword[];
}

// 랭킹 비교 결과 타입
export interface RankingComparison {
  improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
}

// 카테고리 통계 타입
export interface CategoryStats {
  [key: string]: {
    count: number;
    percentage: number;
    topKeywords: ScrapedKeyword[];
  };
}

// 분석 데이터 타입
export interface AnalysisData {
  trendAnalysis: TrendAnalysis;
  rankingComparison: RankingComparison;
  categoryStats: CategoryStats;
  insights: string[];
}

// 통합 데이터 타입
export interface IntegratedData {
  crawlingData?: {
    keywords: ScrapedKeyword[];
    total: number;
  };
  analysis?: AnalysisData;
}

// 처리된 키워드 타입 (트렌드 정보 포함)
export interface ProcessedKeyword extends ScrapedKeyword {
  trend?: TrendType;
  rankChange?: number;
  oldRank?: number;
}

// 필터 상태 타입
export interface FilterState {
  category: string;
  trend: string;
  searchTerm: string;
}

// 정렬 상태 타입
export interface SortState {
  sortBy: SortType;
  sortOrder: SortOrder;
}

// UnifiedKeywordTable 컴포넌트 Props 타입
export interface UnifiedKeywordTableProps {
  integratedData?: IntegratedData | null;
}
