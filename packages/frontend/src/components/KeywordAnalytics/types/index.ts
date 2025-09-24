import { KeywordAnalyticsData } from '@/commons/types';

export interface KeywordAnalyticsProps {
  analytics: KeywordAnalyticsData | null;
  contentCounts?: {
    blogs: number;
    cafes: number;
    total: number;
  } | null;
}
