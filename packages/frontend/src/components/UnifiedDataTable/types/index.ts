import { RelatedKeywordData } from '@/commons/types';

export interface KeywordWithRank {
  keyword: string;
  originalRank: number;
  category: string;
  source: string;
}

export interface UnifiedDataTableProps {
  relatedKeywords?: RelatedKeywordData[] | null;
}
