import { useState, useMemo, useCallback } from 'react';
import { ScrapedKeyword, RelatedKeywordData } from '@/commons/types/workflow';
import {
  IntegratedKeywordItem,
  FilterOptions,
  SortOptions,
  UseFilteredKeywordsReturn,
} from '../types';

/**
 * 기본 필터 옵션
 */
const DEFAULT_FILTERS: FilterOptions = {
  competition: ['low', 'medium', 'high'],
  category: [],
  source: ['smartblock', 'related'],
};

/**
 * 기본 정렬 옵션
 */
const DEFAULT_SORT: SortOptions = {
  field: 'keyword',
  direction: 'asc',
};

/**
 * ScrapedKeyword를 IntegratedKeywordItem으로 변환
 */
const convertScrapedKeyword = (keyword: ScrapedKeyword, index: number): IntegratedKeywordItem => ({
  id: `smartblock-${keyword.keyword}-${index}`,
  keyword: keyword.keyword,
  rank: keyword.rank,
  category: keyword.category,
  competition: keyword.competition,
  similarity: keyword.similarity,
  source: 'smartblock',
  score: keyword.score,
  url: keyword.url,
  metadata: keyword.metadata,
});

/**
 * RelatedKeywordData를 IntegratedKeywordItem으로 변환
 */
const convertRelatedKeyword = (keyword: RelatedKeywordData): IntegratedKeywordItem => {
  // 유사도 점수를 문자열에서 enum으로 변환
  const getSimilarityLevel = (score: string): 'low' | 'medium' | 'high' => {
    switch (score) {
      case '높음':
        return 'high';
      case '보통':
        return 'medium';
      case '낮음':
        return 'low';
      default:
        return 'medium';
    }
  };

  // 검색량 기반으로 경쟁도 추정
  const getCompetitionLevel = (searchVolume: number): 'low' | 'medium' | 'high' => {
    if (searchVolume >= 10000) return 'high';
    if (searchVolume >= 1000) return 'medium';
    return 'low';
  };

  return {
    id: `related-${keyword.id}`,
    keyword: keyword.relatedKeyword,
    rank: keyword.rankPosition,
    category: '연관검색어',
    competition: getCompetitionLevel(keyword.monthlySearchVolume),
    similarity: getSimilarityLevel(keyword.similarityScore),
    source: 'related',
    monthlySearchVolume: keyword.monthlySearchVolume,
    blogCumulativePosts: keyword.blogCumulativePosts,
  };
};

/**
 * 필터링 및 정렬된 키워드 데이터를 관리하는 훅
 */
export const useFilteredKeywords = (
  smartBlockKeywords?: ScrapedKeyword[] | null,
  relatedKeywords?: RelatedKeywordData[] | null,
  initialFilters?: Partial<FilterOptions>,
  initialSort?: SortOptions
): UseFilteredKeywordsReturn => {
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [sortOptions, setSortOptions] = useState<SortOptions>(
    initialSort || DEFAULT_SORT
  );

  // 통합 키워드 데이터 생성
  const integratedKeywords = useMemo(() => {
    console.log('🔄 useFilteredKeywords - 데이터 변환 시작:', {
      smartBlockKeywords: smartBlockKeywords?.length || 0,
      relatedKeywords: relatedKeywords?.length || 0,
      smartBlockData: smartBlockKeywords,
      relatedData: relatedKeywords
    });

    const integrated: IntegratedKeywordItem[] = [];

    // SmartBlock 키워드 추가
    if (smartBlockKeywords && smartBlockKeywords.length > 0) {
      console.log('📝 SmartBlock 키워드 변환 중...', smartBlockKeywords);
      smartBlockKeywords.forEach((keyword, index) => {
        const converted = convertScrapedKeyword(keyword, index);
        console.log('✅ SmartBlock 변환 완료:', keyword.keyword, '→', converted);
        integrated.push(converted);
      });
    } else {
      console.log('⚠️ SmartBlock 키워드가 없습니다');
    }

    // Related 키워드 추가
    if (relatedKeywords && relatedKeywords.length > 0) {
      console.log('📝 Related 키워드 변환 중...', relatedKeywords);
      relatedKeywords.forEach((keyword) => {
        const converted = convertRelatedKeyword(keyword);
        console.log('✅ Related 변환 완료:', keyword.relatedKeyword, '→', converted);
        integrated.push(converted);
      });
    } else {
      console.log('⚠️ Related 키워드가 없습니다');
    }

    console.log('🎯 통합 키워드 생성 완료:', integrated.length, '개', integrated);
    return integrated;
  }, [smartBlockKeywords, relatedKeywords]);

  // 사용 가능한 카테고리 목록
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    integratedKeywords.forEach((keyword) => {
      categories.add(keyword.category);
    });
    return Array.from(categories).sort();
  }, [integratedKeywords]);

  // 필터링된 키워드
  const filteredKeywords = useMemo(() => {
    let filtered = integratedKeywords;

    // 경쟁도 필터
    if (filters.competition.length > 0) {
      filtered = filtered.filter((keyword) =>
        filters.competition.includes(keyword.competition)
      );
    }

    // 카테고리 필터
    if (filters.category.length > 0) {
      filtered = filtered.filter((keyword) =>
        filters.category.includes(keyword.category)
      );
    }

    // 소스 필터
    if (filters.source.length > 0) {
      filtered = filtered.filter((keyword) =>
        filters.source.includes(keyword.source)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      const { field, direction } = sortOptions;
      let aValue: string | number = a[field] || 0;
      let bValue: string | number = b[field] || 0;

      // 문자열 필드의 경우 소문자로 변환
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [integratedKeywords, filters, sortOptions]);

  // 필터 업데이트
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // 정렬 업데이트
  const updateSort = useCallback((newSort: SortOptions) => {
    setSortOptions(newSort);
  }, []);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSortOptions(DEFAULT_SORT);
  }, []);

  return {
    filteredKeywords,
    filters,
    sortOptions,
    updateFilters,
    updateSort,
    resetFilters,
    totalCount: integratedKeywords.length,
    filteredCount: filteredKeywords.length,
    availableCategories,
  };
};
