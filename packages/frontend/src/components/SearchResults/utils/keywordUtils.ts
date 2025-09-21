import { KeywordType, KEYWORD_TYPE_FULL_NAMES } from '@/commons/enums';
import { KeywordData } from '../types';

/**
 * 키워드를 타입별로 그룹화하는 함수
 * @param keywords 키워드 배열
 * @returns 타입별로 그룹화된 키워드 객체
 */
export const groupKeywordsByType = (keywords: KeywordData[]): Record<string, KeywordData[]> => {
  // "추가" 텍스트가 포함된 키워드 필터링 및 중복 제거
  const filteredKeywords = keywords
    .filter(keyword => 
      keyword && 
      keyword.text && 
      typeof keyword.text === 'string' && 
      keyword.text.trim() !== '' &&
      !keyword.text.includes('추가') &&
      keyword.keyword_type &&
      typeof keyword.keyword_type === 'string'
    )
    .reduce((acc, keyword) => {
      // 중복 제거 (text 기준)
      const existingIndex = acc.findIndex(item => item && item.text === keyword.text);
      if (existingIndex === -1) {
        acc.push(keyword);
      }
      return acc;
    }, [] as KeywordData[]);

  return filteredKeywords.reduce((acc, keyword) => {
    const keywordType = keyword.keyword_type || KeywordType.UNKNOWN;
    if (!acc[keywordType]) {
      acc[keywordType] = [];
    }
    acc[keywordType].push(keyword);
    return acc;
  }, {} as Record<string, KeywordData[]>);
};

/**
 * 키워드 타입에 따른 제목을 반환하는 함수
 * @param type 키워드 타입
 * @returns 한글 제목
 */
export const getTypeTitle = (type: string): string => {
  const keywordType = Object.values(KeywordType).find(kt => kt === type);
  if (keywordType && KEYWORD_TYPE_FULL_NAMES[keywordType]) {
    return KEYWORD_TYPE_FULL_NAMES[keywordType];
  }
  
  // 기존 매핑 (하위 호환성)
  switch (type) {
    case KeywordType.AUTOSUGGEST: return '자동완성 키워드';
    case KeywordType.TOGETHER_SEARCHED: return '함께 많이 찾는 키워드';
    case KeywordType.HOT_TOPICS: return '인기주제 키워드';
    case KeywordType.RELATED_KEYWORDS: return '연관검색어';
    case KeywordType.UNKNOWN: return '기타 키워드';
    default: return type || '알 수 없는 타입';
  }
};

/**
 * 키워드 배열을 순위별로 정렬하는 함수
 * @param keywords 키워드 배열
 * @returns 정렬된 키워드 배열
 */
export const sortKeywordsByRank = (keywords: KeywordData[]): KeywordData[] => {
  return keywords.sort((a, b) => a.rank - b.rank);
};
