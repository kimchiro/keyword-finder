// 차트에서 사용하는 공통 타입들

// 월별 검색 비율
export interface MonthlySearchRatio {
  month: string;
  ratio: number;
}

// 요일별 검색 비율  
export interface WeeklySearchRatio {
  dayOfWeek: string;
  ratio: number;
}

// 연령별 검색 비율
export interface AgeSearchRatio {
  age: string;
  ratio: number;
}

// 성별 검색 비율
export interface GenderSearchRatio {
  gender: string;
  ratio: number;
}

// 디바이스별 검색 비율
export interface DeviceSearchRatio {
  device: string;
  ratio: number;
}

// 키워드 속성 (이슈성, 정보성, 상업성)
export interface KeywordAttributes {
  keyword: string;
  issue: number;      // 이슈성 (0-100)
  information: number; // 정보성 (0-100)
  commercial: number;  // 상업성 (0-100)
}

// 연관검색어
export interface RelatedKeyword {
  relKeyword: string;
  monthlyPcQcCnt: number;
  monthlyMobileQcCnt: number;
  monthlyAvePcClkCnt: number;
  monthlyAveMobileClkCnt: number;
  monthlyAvePcCtr: number;
  monthlyAveMobileCtr: number;
  plAvgDepth: number;
  compIdx: string;
}
