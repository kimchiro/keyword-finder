import { KeywordAnalyticsData } from '@/commons/types';

export interface KeywordAnalyticsProps {
  analytics: KeywordAnalyticsData | null;
  contentCounts?: {
    keyword: string;
    searchedAt: string;
    counts: {
      blogs: number;
      cafes: number;
      total: number;
    };
  } | null;
}
