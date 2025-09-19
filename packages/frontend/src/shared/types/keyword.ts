// 공통 키워드 관련 타입들

// 기본 키워드 타입
export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics';

// 키워드 데이터 인터페이스
export interface KeywordData {
  text: string;
  keyword_type: KeywordType;
  rank: number;
}

// 키워드 통계
export interface KeywordStats {
  total: number;
  autosuggest: number;
  togetherSearched: number;
  hotTopics: number;
  topKeywords: Array<{
    text: string;
    count: number;
    type: KeywordType;
  }>;
}

// 대시보드 데이터
export interface DashboardData {
  recentSearches: Array<{
    query: string;
    timestamp: string;
    keywordCount: number;
  }>;
  stats: KeywordStats;
}

// 종합 키워드 분석
export interface ComprehensiveKeywordAnalysis {
  query: string;
  keyword: string; // 호환성을 위해 추가
  totalKeywords: number;
  keywordsByType: Record<KeywordType, KeywordData[]>;
  relatedQueries: string[];
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
  trends?: Array<{
    period: string;
    volume: number;
  }>;
  // 네이버 API 분석 데이터
  monthlyRatio?: Array<{
    month: string;
    ratio: number;
  }>;
  weeklyRatio?: Array<{
    dayOfWeek: string;
    ratio: number;
  }>;
  ageRatio?: Array<{
    age: string;
    ratio: number;
  }>;
  genderRatio?: Array<{
    gender: string;
    ratio: number;
  }>;
  deviceRatio?: Array<{
    device: string;
    ratio: number;
  }>;
  attributes?: {
    keyword: string;
    issue: number;
    information: number;
    commercial: number;
  };
  relatedKeywords?: Array<{
    relKeyword: string;
    monthlyPcQcCnt: number;
    monthlyMobileQcCnt: number;
    monthlyAvePcClkCnt: number;
    monthlyAveMobileClkCnt: number;
    monthlyAvePcCtr: number;
    monthlyAveMobileCtr: number;
    plAvgDepth: number;
    compIdx: string;
  }>;
}

// 통합 키워드 데이터 (크롤링 + 네이버 API)
export interface CrawlingKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  created_at: string;
}

export interface NaverSearchResult {
  id: number;
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
  created_at: string;
}

export interface NaverTrendData {
  id: number;
  period: string;
  ratio: number;
  device?: string;
  gender?: string;
  age_group?: string;
  created_at: string;
}

export interface NaverRelatedKeyword {
  id: number;
  related_keyword: string;
  monthly_pc_qc_cnt: number;
  monthly_mobile_qc_cnt: number;
  monthly_ave_pc_ctr: number;
  monthly_ave_mobile_ctr: number;
  comp_idx: string;
  created_at: string;
}

export interface IntegratedKeywordData {
  query: string;
  crawlingData: CrawlingKeyword[];
  naverApiData: {
    searchResults: NaverSearchResult[];
    trendData: NaverTrendData[];
    relatedKeywords: NaverRelatedKeyword[];
    comprehensiveAnalysis: ComprehensiveKeywordAnalysis | null;
  };
  lastUpdated: string;
}
