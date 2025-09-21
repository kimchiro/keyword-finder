import { 
  TrendType, 
  KeywordType, 
  KEYWORD_TYPE_NAMES, 
  TREND_TYPE_NAMES 
} from '@/commons/enums';
import { 
  ProcessedKeyword, 
  IntegratedData 
} from '../types';

/**
 * 키워드에 트렌드 정보를 추가하여 처리하는 함수
 * @param integratedData 통합 데이터
 * @returns 처리된 키워드 배열
 */
export const processKeywordsWithTrend = (integratedData: IntegratedData): ProcessedKeyword[] => {
  if (!integratedData?.crawlingData?.keywords) return [];

  const keywords = integratedData.crawlingData.keywords;
  const analysis = integratedData.analysis;

  return keywords.map(keyword => {
    let trend: TrendType = TrendType.STABLE;
    let rankChange = 0;
    let oldRank = keyword.rank;

    if (analysis) {
      // 상승 키워드 확인
      const risingKeyword = analysis.trendAnalysis.rising.find(k => k.text === keyword.text);
      if (risingKeyword) trend = TrendType.RISING;

      // 하락 키워드 확인
      const fallingKeyword = analysis.trendAnalysis.falling.find(k => k.text === keyword.text);
      if (fallingKeyword) trend = TrendType.FALLING;

      // 신규 키워드 확인
      const newKeyword = analysis.trendAnalysis.new.find(k => k.text === keyword.text);
      if (newKeyword) trend = TrendType.NEW;

      // 랭킹 변화 확인
      const improvedKeyword = analysis.rankingComparison.improved.find(k => k.keyword.text === keyword.text);
      if (improvedKeyword) {
        rankChange = improvedKeyword.change;
        oldRank = improvedKeyword.oldRank;
      }

      const declinedKeyword = analysis.rankingComparison.declined.find(k => k.keyword.text === keyword.text);
      if (declinedKeyword) {
        rankChange = -declinedKeyword.change;
        oldRank = declinedKeyword.oldRank;
      }
    }

    return {
      ...keyword,
      trend,
      rankChange,
      oldRank
    };
  });
};

/**
 * 카테고리 이름을 한글로 변환하는 함수
 * @param type 카테고리 타입
 * @returns 한글 카테고리 이름
 */
export const getCategoryName = (type: string): string => {
  return KEYWORD_TYPE_NAMES[type as KeywordType] || type;
};

/**
 * 트렌드 이름을 한글로 변환하는 함수
 * @param trend 트렌드 타입
 * @returns 한글 트렌드 이름
 */
export const getTrendName = (trend: string): string => {
  return TREND_TYPE_NAMES[trend as TrendType] || trend;
};

/**
 * 키워드 타입을 enum으로 변환하는 함수
 * @param type 키워드 타입 문자열
 * @returns KeywordType enum
 */
export const getKeywordTypeEnum = (type: string): KeywordType => {
  return Object.values(KeywordType).find(kt => kt === type) || KeywordType.UNKNOWN;
};

/**
 * 날짜를 한국 형식으로 포맷하는 함수
 * @param dateString 날짜 문자열
 * @returns 포맷된 날짜
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};
