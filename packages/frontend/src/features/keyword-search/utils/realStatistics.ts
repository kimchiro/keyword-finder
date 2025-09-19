import { KeywordStatistics, StatisticsData, EnhancedKeyword } from '../types/analysis';

interface KeywordData {
  text: string;
  keyword_type?: string;
  category?: string;
  rank?: number;
}


/**
 * 스크래핑된 실제 데이터를 기반으로 통계 생성 (임시값 사용 안함)
 */
export function generateRealStatistics(keywords: KeywordData[]): {
  keywordStatistics: KeywordStatistics;
  relatedKeywords: EnhancedKeyword[];
} {
  if (!keywords || keywords.length === 0) {
    return {
      keywordStatistics: createEmptyStatistics(),
      relatedKeywords: []
    };
  }

  // 실제 키워드 데이터를 EnhancedKeyword 형태로 변환
  const enhancedKeywords: EnhancedKeyword[] = keywords.slice(0, 20).map((keyword) => {
    // 실제 데이터만 사용 - API 데이터가 없으므로 0으로 설정
    return {
      relKeyword: keyword.text,
      monthlyPcQcCnt: 0, // 실제 API 데이터가 없음
      monthlyMobileQcCnt: 0,
      monthlyAvePcClkCnt: 0,
      monthlyAveMobileClkCnt: 0,
      monthlyAvePcCtr: 0,
      monthlyAveMobileCtr: 0,
      pcCompIdx: '정보없음',
      mobileCompIdx: '정보없음',
      totalSearchVolume: 0,
      totalClickCount: 0,
      avgCtr: 0,
      competitionLevel: '정보없음',
      // 실제 스크래핑 데이터
      category: keyword.category || '일반',
      keywordType: keyword.keyword_type || 'unknown',
      rank: keyword.rank || 0
    };
  });

  // 실제 데이터 기반 통계 계산
  const keywordStatistics: KeywordStatistics = {
    searchVolume: {
      pc: createRealStatistics('PC 검색량', '', []), // 실제 데이터 없음
      mobile: createRealStatistics('모바일 검색량', '', []),
      total: createRealStatistics('총 검색량', '', [])
    },
    clickCount: {
      pc: createRealStatistics('PC 클릭수', '', []),
      mobile: createRealStatistics('모바일 클릭수', '', [])
    },
    ctr: {
      pc: createRealStatistics('PC CTR', '%', []),
      mobile: createRealStatistics('모바일 CTR', '%', [])
    },
    competition: {
      pc: createRealStatistics('PC 경쟁도', '', []),
      mobile: createRealStatistics('모바일 경쟁도', '', []),
      levelDistribution: analyzeKeywordTypes(keywords),
      averageLevel: getMostCommonCategory(keywords)
    }
  };

  return {
    keywordStatistics,
    relatedKeywords: enhancedKeywords
  };
}

/**
 * 실제 데이터 기반 통계 생성 (값이 없으면 '데이터 없음' 표시)
 */
function createRealStatistics(label: string, unit: string, values: number[]): StatisticsData {
  if (values.length === 0) {
    return {
      label,
      unit,
      count: 0,
      min: '데이터 없음',
      max: '데이터 없음',
      average: '데이터 없음',
      median: '데이터 없음',
      q1: '데이터 없음',
      q3: '데이터 없음',
      standardDeviation: '데이터 없음'
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / values.length;
  
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  
  const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    label,
    unit,
    count: values.length,
    min: formatNumber(Math.min(...values), unit),
    max: formatNumber(Math.max(...values), unit),
    average: formatNumber(average, unit),
    median: formatNumber(median, unit),
    q1: formatNumber(q1, unit),
    q3: formatNumber(q3, unit),
    standardDeviation: formatNumber(standardDeviation, unit)
  };
}

/**
 * 실제 키워드 타입 분석
 */
function analyzeKeywordTypes(keywords: KeywordData[]): Record<string, number> {
  const typeCounts: Record<string, number> = {};
  
  keywords.forEach(keyword => {
    const type = keyword.keyword_type || '기타';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return typeCounts;
}

/**
 * 가장 많은 카테고리 찾기
 */
function getMostCommonCategory(keywords: KeywordData[]): string {
  const categoryCounts: Record<string, number> = {};
  
  keywords.forEach(keyword => {
    const category = keyword.category || '일반';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .reduce((a, b) => categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b)[0] || '일반';
}

function formatNumber(num: number, unit: string): string {
  if (unit === '%') {
    return `${num.toFixed(2)}%`;
  }
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

function createEmptyStatistics(): KeywordStatistics {
  const emptyStats: StatisticsData = {
    label: '',
    unit: '',
    count: 0,
    min: '데이터 없음',
    max: '데이터 없음',
    average: '데이터 없음',
    median: '데이터 없음',
    q1: '데이터 없음',
    q3: '데이터 없음',
    standardDeviation: '데이터 없음'
  };

  return {
    searchVolume: {
      pc: { ...emptyStats, label: 'PC 검색량' },
      mobile: { ...emptyStats, label: '모바일 검색량' },
      total: { ...emptyStats, label: '총 검색량' }
    },
    clickCount: {
      pc: { ...emptyStats, label: 'PC 클릭수' },
      mobile: { ...emptyStats, label: '모바일 클릭수' }
    },
    ctr: {
      pc: { ...emptyStats, label: 'PC CTR', unit: '%' },
      mobile: { ...emptyStats, label: '모바일 CTR', unit: '%' }
    },
    competition: {
      pc: { ...emptyStats, label: 'PC 경쟁도' },
      mobile: { ...emptyStats, label: '모바일 경쟁도' },
      levelDistribution: {},
      averageLevel: '데이터 없음'
    }
  };
}
