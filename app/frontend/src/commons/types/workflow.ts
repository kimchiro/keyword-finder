import { NaverBlogSearchResult, NaverDatalabResult } from './naver';

/**
 * 스크래핑된 키워드 데이터 (백엔드 응답 구조)
 */
export interface ScrapedKeyword {
  keywordId?: number;          // 백엔드에서 추가된 필드
  keyword: string;
  category: string;
  rank?: number;               // 선택적 필드 (이전 호환성)
  rankPosition?: number;       // 백엔드 필드명
  collectedAt?: string;        // 백엔드에서 추가된 필드
  competition?: 'low' | 'medium' | 'high';  // 선택적 (실시간 계산)
  similarity?: 'low' | 'medium' | 'high';   // 선택적 (실시간 계산)
  score?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 스크래핑 결과 데이터
 */
export interface ScrapingData {
  query: string;
  keywords: ScrapedKeyword[];
  totalCount: number;
  categories: Record<string, number>;
  topKeywords: string[];
  keywordsWithRank: Array<{
    keyword: string;
    originalRank: number;
    category: string;
    source: string;
  }>;
  scrapingTime: number;
  timestamp: string;
}

/**
 * 네이버 API 데이터 (백엔드 워크플로우에서 반환)
 */
export interface NaverApiData {
  keyword: string;
  blogSearch: NaverBlogSearchResult;
  datalab: NaverDatalabResult;
  searchPeriod: {
    startDate: string;
    endDate: string;
  };
  timestamp: string;
}

/**
 * 키워드 엔티티 (조인 결과)
 */
export interface KeywordEntity {
  id: number;
  keyword: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

/**
 * 키워드 분석 데이터 (백엔드에서 생성)
 */
export interface KeywordAnalyticsData {
  id: number;
  keywordId: number;                   // 백엔드에서 반환하는 외래키
  keyword?: string;                     // 선택적 (이전 호환성)
  monthlySearchPc: number | string;
  monthlySearchMobile: number | string;
  monthlySearchTotal: number | string;
  monthlyContentBlog: number;
  monthlyContentCafe: number;
  monthlyContentAll: number;
  estimatedSearchYesterday: number | string;
  estimatedSearchEndMonth: number | string;
  saturationIndexBlog: number | string;
  saturationIndexCafe: number | string;
  saturationIndexAll: number | string;
  analysisDate: string;
  createdAt: string;
  updatedAt: string;
  keywordEntity?: KeywordEntity;        // 백엔드 조인 결과
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
  searchRatio?: number;
  id?: number;
  createdAt?: string;
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
 * 차트 데이터 통합
 */
export interface ChartData {
  searchTrends: SearchTrendData[];
  monthlyRatios: MonthlySearchRatioData[];
  issueAnalysis: IssueAnalysisData | null;
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
    contentCountsData?: {
      keyword: string;
      searchedAt: string;
      counts: {
        blogs: number;
        cafes: number;
        total: number;
      };
      savedToDatabase?: {
        id: number;
        analysisDate: string;
        monthlyContentBlog: number;
        monthlyContentCafe: number;
        monthlyContentAll: number;
      };
    };
    scrapingData: ScrapingData;
    analysisData: AnalysisData | null;
    chartData?: ChartData;              // 백엔드가 최상위 레벨에도 반환
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
