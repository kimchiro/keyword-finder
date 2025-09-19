// Dashboard feature types
import { KeywordData, DashboardData, KeywordStats, IntegratedKeywordData } from '../../../shared/types';

// Keyword Modal Types
export interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  keywords: KeywordData[];
  onCopy: () => void;
}

// Naver Search Types
export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export interface NaverSearchData {
  lastBuildDate?: string;
  total: number;
  start?: number;
  display?: number;
  items: NaverSearchItem[];
}

export interface NaverSearchCardProps {
  searchData: NaverSearchData | null;
  query?: string;
}

// Naver Trend Types
export interface NaverTrendData {
  period: string;
  ratio: number;
}

export interface NaverTrendResult {
  title: string;
  keywords: string[];
  data: NaverTrendData[];
}

export interface NaverTrendResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: NaverTrendResult[];
}

export interface NaverTrendChartProps {
  trendData: NaverTrendResponse | NaverTrendResult[] | null;
  query?: string;
}

// Recent Searches Types
export interface RecentSearchesProps {
  recentSearches: DashboardData['recentSearches'];
  onQueryClick: (query: string) => void;
}

// Stats Cards Types
export interface StatsCardsProps {
  stats: KeywordStats;
}

// Toast Types
export interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

// Top Keywords Types
export interface TopKeywordsProps {
  topKeywords: KeywordStats['topKeywords'];
}

// Dashboard Page Types
export interface DashboardHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onNaverSearch: () => void;
  onRefresh: () => void;
  naverLoading: boolean;
  loading: boolean;
}

export interface NaverResultsDisplayProps {
  searchData: NaverSearchData | null;
  trendData: NaverTrendResponse | NaverTrendResult[] | null;
  currentQuery?: string;
}

export interface IntegratedDataDisplayProps {
  data: IntegratedKeywordData;
}