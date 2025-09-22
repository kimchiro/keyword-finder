import { NaverBlogSearchResult, NaverDatalabResult } from './naver';

/**
 * 스크래핑된 키워드 데이터
 */
export interface ScrapedKeyword {
  keyword: string;
  category: string;
  rank: number;
  competition: 'low' | 'medium' | 'high';
  similarity: 'low' | 'medium' | 'high';
  score?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 스크래핑 결과 데이터
 */
export interface ScrapingData {
  query: string;
  totalKeywords: number;
  executionTime: number;
  categories: Record<string, number>;
  keywords: ScrapedKeyword[];
}

/**
 * 네이버 API 데이터 (백엔드 워크플로우에서 반환)
 */
export interface NaverApiData {
  original: {
    blogSearch: NaverBlogSearchResult;
    datalab: NaverDatalabResult;
  };
  firstBatch: NaverDatalabResult | null;
  secondBatch: NaverDatalabResult | null;
}

/**
 * 키워드 분석 데이터 (백엔드에서 생성)
 */
export interface KeywordAnalyticsData {
  keyword: string;
  monthlySearchPc: number;
  monthlySearchMobile: number;
  monthlySearchTotal: number;
  monthlyContentBlog: number;
  monthlyContentCafe: number;
  monthlyContentAll: number;
  estimatedSearchYesterday: number;
  estimatedSearchEndMonth: number;
  saturationIndexBlog: number;
  saturationIndexCafe: number;
  saturationIndexAll: number;
  analysisDate: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 연관 키워드 데이터
 */
export interface RelatedKeywordData {
  baseKeyword: string;
  relatedKeyword: string;
  monthlySearchVolume: number;
  blogCumulativePosts: number;
  similarityScore: '낮음' | '보통' | '높음';
  rankPosition: number;
  analysisDate: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 검색 트렌드 차트 데이터
 */
export interface SearchTrendData {
  keyword: string;
  periodType: 'daily' | 'weekly' | 'monthly';
  periodValue: string;
  searchVolume: number;
  searchRatio: number;
  id: number;
  createdAt: string;
}

/**
 * 월별 검색 비율 데이터
 */
export interface MonthlySearchRatioData {
  keyword: string;
  monthNumber: number;
  searchRatio: number;
  analysisYear: number;
  id: number;
  createdAt: string;
}

/**
 * 요일별 검색 비율 데이터
 */
export interface WeekdaySearchRatioData {
  keyword: string;
  weekdayNumber: number;
  searchRatio: number;
  analysisDate: string;
  id: number;
  createdAt: string;
}

/**
 * 성별 검색 비율 데이터
 */
export interface GenderSearchRatioData {
  keyword: string;
  maleRatio: number;
  femaleRatio: number;
  analysisDate: string;
  id: number;
  createdAt: string;
}

/**
 * 이슈성 분석 데이터
 */
export interface IssueAnalysisData {
  keyword: string;
  issueType: '급상승' | '안정' | '하락' | '신규';
  issueScore: number;
  trendDirection: '상승' | '하락' | '유지';
  volatilityScore: number;
  analysisDate: string;
  id: number;
  createdAt: string;
}

/**
 * 의도 분석 데이터 (정보성/상업성)
 */
export interface IntentAnalysisData {
  keyword: string;
  informationalRatio: number;
  commercialRatio: number;
  primaryIntent: '정보성' | '상업성' | '혼합';
  confidenceScore: number;
  analysisDate: string;
  id: number;
  createdAt: string;
}

/**
 * 차트 데이터 통합
 */
export interface ChartData {
  searchTrends: SearchTrendData[];
  monthlyRatios: MonthlySearchRatioData[];
  weekdayRatios: WeekdaySearchRatioData[];
  genderRatios: GenderSearchRatioData | null;
  issueAnalysis: IssueAnalysisData | null;
  intentAnalysis: IntentAnalysisData | null;
}

/**
 * 키워드 분석 전체 데이터
 */
export interface AnalysisData {
  analytics: KeywordAnalyticsData;
  relatedKeywords: RelatedKeywordData[];
  chartData: ChartData;
}

/**
 * 워크플로우 응답 데이터 (백엔드 실제 응답 구조)
 */
export interface WorkflowResponse {
  success: boolean;
  data: {
    query: string;
    naverApiData: NaverApiData;
    scrapingData: ScrapingData;
    analysisData: AnalysisData | null;
    topKeywords: string[];
    keywordsWithRank: Array<{
      keyword: string;
      originalRank: number;
      category: string;
      source: string;
    }>;
    executionTime: number;
    timestamp: string;
  };
  message: string;
}

/**
 * 워크플로우 상태 체크 응답
 */
export interface WorkflowHealthResponse {
  success: boolean;
  message: string;
  data: {
    naverApi: boolean;
    scraping: boolean;
    analysis: boolean;
    overall: boolean;
  };
}
