import { useState } from 'react';
import type { NaverSearchState, NaverSearchOptions, NaverDatalabOptions } from '@/commons/types';
import { searchNaverBlogs, getNaverTrend } from '@/commons/apis';

/**
 * 네이버 검색 상태 관리 훅
 * API 통신 없이 순수한 상태 관리만 담당합니다.
 */
export const useNaverSearch = () => {
  const [state, setState] = useState<NaverSearchState>({
    loading: false,
    searchResults: null,
    datalabResults: null,
    error: null,
  });

  const searchBlogs = async (query: string, options: NaverSearchOptions = {}) => {
    if (!query.trim()) return;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      searchResults: null, // 새 검색 시 이전 결과 즉시 제거
    }));

    try {
      const result = await searchNaverBlogs(query, options);
      
      setState(prev => ({
        ...prev,
        loading: false,
        searchResults: result,
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '네이버 블로그 검색 중 오류가 발생했습니다.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  const getSearchTrend = async (options: NaverDatalabOptions) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      datalabResults: null,
    }));

    try {
      const result = await getNaverTrend(options);
      
      setState(prev => ({
        ...prev,
        loading: false,
        datalabResults: result,
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '네이버 데이터랩 조회 중 오류가 발생했습니다.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  const clearResults = () => {
    setState({
      loading: false,
      searchResults: null,
      datalabResults: null,
      error: null,
    });
  };

  const searchAll = async (query: string) => {
    if (!query.trim()) return;

    // 이전 결과 초기화
    clearResults();
    
    try {
      // 네이버 블로그 검색
      await searchBlogs(query, { display: 10, sort: 'sim' });
      
      // 네이버 데이터랩 트렌드 (최근 1년)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      
      await getSearchTrend({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        timeUnit: 'month' as const,
        keywordGroups: [{ groupName: query, keywords: [query] }],
      });
    } catch (error) {
      console.error('❌ [통합 검색] 오류:', error);
      // 개별 함수에서 이미 에러 처리를 하므로 여기서는 로그만 남김
    }
  };

  return {
    ...state,
    searchBlogs,
    getSearchTrend,
    clearResults,
    searchAll,
  };
};