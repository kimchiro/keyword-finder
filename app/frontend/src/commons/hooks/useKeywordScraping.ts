import { useState } from 'react';
import type { ScrapingState, ScrapingOptions } from '@/commons/types';
import { scrapeKeywords as apiScrapeKeywords } from '@/commons/apis';

/**
 * 키워드 스크래핑 상태 관리 훅
 * API 통신 없이 순수한 상태 관리만 담당합니다.
 */
export const useKeywordScraping = () => {
  const [state, setState] = useState<ScrapingState>({
    loading: false,
    results: null,
    error: null,
  });

  const scrapeKeywords = async (query: string, options: ScrapingOptions = {}) => {
    if (!query.trim()) return Promise.resolve();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      results: null,
    }));

    try {
      const result = await apiScrapeKeywords(query, options);
      
      setState(prev => {
        const newState = {
          ...prev,
          loading: false,
          results: result,
        };
        console.log('✅ [키워드 스크래핑] 상태 업데이트 완료:', {
          previousState: prev,
          newState,
          responseData: result
        });
        return newState;
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '키워드 수집 중 오류가 발생했습니다.';
      
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
      results: null,
      error: null,
    });
  };

  return {
    ...state,
    scrapeKeywords,
    clearResults,
  };
};