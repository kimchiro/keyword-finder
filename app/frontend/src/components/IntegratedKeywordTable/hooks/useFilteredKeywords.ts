import { useState, useMemo, useCallback, useEffect } from 'react';
import { ScrapedKeyword, RelatedKeywordData } from '@/commons/types/workflow';
import {
  IntegratedKeywordItem,
  FilterOptions,
  SortOptions,
  UseFilteredKeywordsReturn,
} from '../types';

/**
 * 기본 필터 옵션 - 카테고리 필터만 사용
 */
const DEFAULT_FILTERS: FilterOptions = {
  competition: [], // 사용하지 않음
  category: [],    // 빈 배열 = 모든 카테고리 허용
  source: [],      // 사용하지 않음
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
const convertScrapedKeyword = (keyword: ScrapedKeyword, index: number): IntegratedKeywordItem => {
  // 안전한 기본값 설정
  const getCompetitionLevel = (comp?: 'low' | 'medium' | 'high'): 'low' | 'medium' | 'high' => {
    return comp || 'medium';
  };

  const getSimilarityLevel = (sim?: 'low' | 'medium' | 'high'): 'low' | 'medium' | 'high' => {
    return sim || 'medium';
  };

  // 카테고리를 한국어로 변환
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'smartblock':
        return '스마트블록';
      case 'related':
      case 'related_search':
        return '연관검색어';
      case 'autosuggest':
        return '자동완성';
      default:
        return category;
    }
  };

  // 소스를 카테고리에 따라 설정
  const getSourceType = (category: string): 'smartblock' | 'related' => {
    switch (category) {
      case 'smartblock':
        return 'smartblock';
      case 'related':
      case 'related_search':
      case 'autosuggest':
        return 'related';
      default:
        return 'smartblock';
    }
  };

  return {
    id: `scraped-${keyword.keyword}-${index}`,
    keyword: keyword.keyword,
    rank: keyword.rank || keyword.rankPosition || index + 1,  // rank와 rankPosition 모두 지원
    category: getCategoryName(keyword.category),
    competition: getCompetitionLevel(keyword.competition),
    similarity: getSimilarityLevel(keyword.similarity),
    source: getSourceType(keyword.category),
    score: keyword.score,
    url: keyword.url,
    metadata: keyword.metadata,
  };
};

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
  // 사용 가능한 카테고리 목록을 먼저 계산
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    if (smartBlockKeywords) {
      smartBlockKeywords.forEach((keyword) => {
        const categoryName = keyword.category === 'smartblock' ? '스마트블록' : 
                           keyword.category === 'related' || keyword.category === 'related_search' ? '연관검색어' :
                           keyword.category === 'autosuggest' ? '자동완성' : keyword.category;
        categories.add(categoryName);
      });
    }
    if (relatedKeywords) {
      categories.add('연관검색어');
    }
    return Array.from(categories).sort();
  }, [smartBlockKeywords, relatedKeywords]);

  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // availableCategories가 변경되면 카테고리 필터를 모든 카테고리로 설정
  useEffect(() => {
    if (availableCategories.length > 0 && filters.category.length === 0) {
      console.log('🔄 카테고리 필터 자동 설정:', availableCategories);
      setFilters(prev => ({
        ...prev,
        category: [...availableCategories]
      }));
    }
  }, [availableCategories, filters.category.length]);

  // 필터 상태 디버깅
  console.log('🎛️ 현재 필터 상태:', {
    filters,
    DEFAULT_FILTERS,
    initialFilters,
    availableCategories
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

    console.log('🎯 통합 키워드 생성 완료:', {
      totalCount: integrated.length,
      sampleData: integrated.slice(0, 3),
      allData: integrated
    });
    return integrated;
  }, [smartBlockKeywords, relatedKeywords]);

  // availableCategories는 이미 위에서 계산됨

  // 필터링된 키워드 - 카테고리 필터만 적용
  const filteredKeywords = useMemo(() => {
    console.log('🔍 필터링 시작 (카테고리 필터만):', {
      totalKeywords: integratedKeywords.length,
      categoryFilters: filters.category,
      sampleKeywords: integratedKeywords.slice(0, 3).map(k => ({
        keyword: k.keyword,
        category: k.category
      }))
    });

    let filtered = integratedKeywords;

    // 카테고리 필터만 적용 - 빈 배열이면 모든 카테고리 허용
    if (filters.category.length > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter((keyword) =>
        filters.category.includes(keyword.category)
      );
      console.log(`📂 카테고리 필터 적용: ${beforeCount} → ${filtered.length}개`, {
        allowedCategories: filters.category,
        sampleCategories: integratedKeywords.slice(0, 5).map(k => k.category)
      });
    } else {
      console.log(`📂 카테고리 필터 건너뜀 - 모든 카테고리 허용`);
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

    console.log('✅ 필터링 완료:', {
      finalCount: filtered.length,
      sampleFiltered: filtered.slice(0, 3).map(k => ({
        keyword: k.keyword,
        category: k.category,
        competition: k.competition,
        source: k.source
      }))
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
    integratedKeywords, // 원본 데이터도 반환
  };
};
