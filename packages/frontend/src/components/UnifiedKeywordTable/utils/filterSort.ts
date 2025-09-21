import { SortType, SortOrder } from '@/commons/enums';
import { ProcessedKeyword, FilterState, SortState } from '../types';

/**
 * 키워드를 필터링하는 함수
 * @param keywords 키워드 배열
 * @param filters 필터 상태
 * @returns 필터링된 키워드 배열
 */
export const filterKeywords = (
  keywords: ProcessedKeyword[], 
  filters: FilterState
): ProcessedKeyword[] => {
  let filtered = keywords;

  // 카테고리 필터
  if (filters.category !== 'all') {
    filtered = filtered.filter(item => item.keyword_type === filters.category);
  }

  // 트렌드 필터
  if (filters.trend !== 'all') {
    filtered = filtered.filter(item => item.trend === filters.trend);
  }

  // 검색어 필터
  if (filters.searchTerm) {
    filtered = filtered.filter(item => 
      item.text.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }

  return filtered;
};

/**
 * 키워드를 정렬하는 함수
 * @param keywords 키워드 배열
 * @param sortState 정렬 상태
 * @returns 정렬된 키워드 배열
 */
export const sortKeywords = (
  keywords: ProcessedKeyword[], 
  sortState: SortState
): ProcessedKeyword[] => {
  const { sortBy, sortOrder } = sortState;
  
  return [...keywords].sort((a, b) => {
    let aValue: string | number = a[sortBy] as string | number;
    let bValue: string | number = b[sortBy] as string | number;

    if (sortBy === SortType.CREATED_AT) {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (sortOrder === SortOrder.ASC) {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

/**
 * 필터링과 정렬을 동시에 수행하는 함수
 * @param keywords 키워드 배열
 * @param filters 필터 상태
 * @param sortState 정렬 상태
 * @returns 필터링되고 정렬된 키워드 배열
 */
export const filterAndSortKeywords = (
  keywords: ProcessedKeyword[],
  filters: FilterState,
  sortState: SortState
): ProcessedKeyword[] => {
  const filtered = filterKeywords(keywords, filters);
  return sortKeywords(filtered, sortState);
};
