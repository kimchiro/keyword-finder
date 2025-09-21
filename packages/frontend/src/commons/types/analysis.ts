// 스크래핑된 키워드 타입
export interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

// 키워드 트렌드 분석 결과
export interface KeywordTrendAnalysis {
  rising: ScrapedKeyword[];      // 상승 키워드
  falling: ScrapedKeyword[];     // 하락 키워드
  stable: ScrapedKeyword[];      // 안정 키워드
  new: ScrapedKeyword[];         // 신규 키워드
  disappeared: ScrapedKeyword[]; // 사라진 키워드
}

// 랭킹 변화 분석
export interface RankingComparison {
  improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
}

// 카테고리별 통계
export interface CategoryStats {
  [key: string]: {
    count: number;
    percentage: number;
    topKeywords: ScrapedKeyword[];
  };
}

// 시계열 데이터
export interface TimeSeriesData {
  date: string;
  keywordCount: number;
  topKeywords: ScrapedKeyword[];
  categoryDistribution: { [key: string]: number };
}

// 통합 데이터 타입
export interface IntegratedData {
  query: string;
  crawlingData: {
    keywords: ScrapedKeyword[];
    total: number;
  };
  naverApiData: {
    searchResults: number;
    trendData: number;
    relatedKeywords: number;
  };
  lastUpdated: string;
}

// 향상된 통합 데이터
export interface EnhancedIntegratedData extends IntegratedData {
  analysis?: {
    trendAnalysis: KeywordTrendAnalysis;
    rankingComparison: RankingComparison;
    categoryStats: CategoryStats;
    timeSeriesData: TimeSeriesData[];
    insights: string[];
  };
}

// 키워드 분석 상태 타입
export interface KeywordAnalysisState {
  loading: boolean;
  data: EnhancedIntegratedData | null;
  error: string | null;
}
