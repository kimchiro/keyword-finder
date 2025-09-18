import { useState } from 'react';
import axios from 'axios';
import { SearchOptions, SearchState } from '../types';

export const useKeywordSearch = () => {
  const [state, setState] = useState<SearchState>({
    loading: false,
    results: null,
    error: null,
  });

  const searchKeywords = async (query: string, options: SearchOptions = {}) => {
    if (!query.trim()) return;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      results: null,
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/scrape', {
        query,
        options: {
          headless: options.headless ?? true,
          maxPagesPerModule: options.maxPagesPerModule ?? 2,
          saveToDb: options.saveToDb ?? true,
        },
      });

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          results: response.data,
        }));
      } else {
        throw new Error(response.data.error || '스크래핑에 실패했습니다.');
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: '키워드 수집 중 오류가 발생했습니다.',
      }));
      console.error(err);
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
    searchKeywords,
    clearResults,
  };
};
