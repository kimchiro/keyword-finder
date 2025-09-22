import { KeywordData } from '../types';

/**
 * 키워드를 카테고리별로 그룹화하는 함수
 * @param keywords 키워드 배열
 * @returns 카테고리별로 그룹화된 키워드 객체
 */
export const groupKeywordsByCategory = (keywords: KeywordData[]): Record<string, KeywordData[]> => {
  // 유효한 키워드 필터링 및 중복 제거 (related_search 카테고리 제외)
  const filteredKeywords = keywords
    .filter(keyword => 
      keyword && 
      keyword.keyword && 
      typeof keyword.keyword === 'string' && 
      keyword.keyword.trim() !== '' &&
      keyword.category &&
      typeof keyword.category === 'string' &&
      keyword.category !== 'related_search' // related_search 카테고리 제외
    )
    .reduce((acc, keyword) => {
      // 중복 제거 (keyword 기준)
      const existingIndex = acc.findIndex(item => item && item.keyword === keyword.keyword);
      if (existingIndex === -1) {
        acc.push(keyword);
      }
      return acc;
    }, [] as KeywordData[]);

  return filteredKeywords.reduce((acc, keyword) => {
    const category = keyword.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(keyword);
    return acc;
  }, {} as Record<string, KeywordData[]>);
};

/**
 * 키워드 배열을 점수별로 정렬하는 함수
 * @param keywords 키워드 배열
 * @returns 정렬된 키워드 배열 (점수 높은 순)
 */
export const sortKeywordsByScore = (keywords: KeywordData[]): KeywordData[] => {
  return keywords.sort((a, b) => (b.score || 0) - (a.score || 0));
};
