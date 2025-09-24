import { ScrapedKeyword, RelatedKeywordData } from '@/commons/types/workflow';

/**
 * 통합 키워드 데이터 타입
 * SmartBlock과 RelatedKeywords 데이터를 정규화한 통합 형태
 */
export interface IntegratedKeywordItem {
  id: string;
  keyword: string;
  rank: number;
  category: string;
  competition: 'low' | 'medium' | 'high';
  similarity: 'low' | 'medium' | 'high';
  source: 'smartblock' | 'related';
  monthlySearchVolume?: number;
  blogCumulativePosts?: number;
  score?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 필터 옵션 타입
 */
export interface FilterOptions {
  competition: ('low' | 'medium' | 'high')[];
  category: string[];
  source: ('smartblock' | 'related')[];
}

/**
 * 정렬 옵션 타입
 */
export interface SortOptions {
  field: 'rank' | 'keyword' | 'competition' | 'similarity' | 'monthlySearchVolume' | 'blogCumulativePosts';
  direction: 'asc' | 'desc';
}

/**
 * IntegratedKeywordTable 컴포넌트 Props
 */
export interface IntegratedKeywordTableProps {
  smartBlockKeywords?: ScrapedKeyword[] | null;
  relatedKeywords?: RelatedKeywordData[] | null;
  initialFilters?: Partial<FilterOptions>;
  initialSort?: SortOptions;
  showFilters?: boolean;
  maxItems?: number;
}

/**
 * 필터 상태 관리 훅의 반환 타입
 */
export interface UseFilteredKeywordsReturn {
  filteredKeywords: IntegratedKeywordItem[];
  filters: FilterOptions;
  sortOptions: SortOptions;
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  updateSort: (newSort: SortOptions) => void;
  resetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  availableCategories: string[];
}
