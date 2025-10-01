export interface KeywordAnalysis {
  keyword: string;
  issue: number;
  information: number;
  commercial: number;
}

export interface Demographics {
  gender: Array<{ gender: string; ratio: number }>;
  age: Array<{ age: string; ratio: number }>;
  device: Array<{ device: string; ratio: number }>;
  weekly: Array<{ dayOfWeek: string; ratio: number }>;
}

// 통계 데이터 인터페이스
export interface StatisticsData {
  label: string;
  unit: string;
  count: number;
  min: number | string;
  max: number | string;
  average: number | string;
  median: number | string;
  q1: number | string;
  q3: number | string;
  standardDeviation: number | string;
}

// 경쟁도 분석 인터페이스
export interface CompetitionAnalysis {
  pc: StatisticsData;
  mobile: StatisticsData;
  levelDistribution: Record<string, number>;
  averageLevel: string;
}

// 키워드 통계 인터페이스
export interface KeywordStatistics {
  searchVolume: {
    pc: StatisticsData;
    mobile: StatisticsData;
    total: StatisticsData;
  };
  clickCount: {
    pc: StatisticsData;
    mobile: StatisticsData;
  };
  ctr: {
    pc: StatisticsData;
    mobile: StatisticsData;
  };
  competition: CompetitionAnalysis;
}

// 향상된 키워드 데이터 인터페이스
export interface EnhancedKeyword {
  relKeyword: string;
  monthlyPcQcCnt: number;
  monthlyMobileQcCnt: number;
  monthlyAvePcClkCnt: number;
  monthlyAveMobileClkCnt: number;
  monthlyAvePcCtr: number;
  monthlyAveMobileCtr: number;
  pcCompIdx: string;
  mobileCompIdx: string;
  // 계산된 필드들
  totalSearchVolume: number;
  totalClickCount: number;
  avgCtr: number;
  competitionLevel: string;
  // 스크래핑 데이터 추가 필드들
  category?: string;
  keywordType?: string;
  rank?: number;
}

// 트렌드 데이터 인터페이스
export interface TrendData {
  title: string;
  keywords: string[];
  data: Array<{
    period: string;
    ratio: number;
  }>;
}

// 성별 분석 인터페이스
export interface GenderAnalysis {
  male: TrendData | null;
  female: TrendData | null;
}

export interface ComprehensiveAnalysisData {
  keyword: string;
  relatedKeywords: EnhancedKeyword[];
  keywordStatistics: KeywordStatistics | null;
  searchTrend: TrendData | null;
  genderAnalysis: GenderAnalysis;
  totalKeywords?: number;
  generatedAt: string;
  // 기존 호환성을 위한 필드들
  keywordAnalysis?: KeywordAnalysis;
  demographics?: Demographics;
}
