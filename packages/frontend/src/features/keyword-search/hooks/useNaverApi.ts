import { useState } from 'react';
import axios from 'axios';
import { 
  NaverSearchApiResponse, 
  NaverDatalabApiResponse, 
  NaverSearchOptions, 
  NaverDatalabOptions 
} from '../types';

interface NaverApiState {
  loading: boolean;
  searchResults: NaverSearchApiResponse | null;
  datalabResults: NaverDatalabApiResponse | null;
  error: string | null;
}

export const useNaverApi = () => {
  const [state, setState] = useState<NaverApiState>({
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
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/naver/search', {
        query,
        display: options.display || 10,
        start: options.start || 1,
        sort: options.sort || 'sim',
      });

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          searchResults: response.data,
        }));
      } else {
        throw new Error(response.data.error || '네이버 검색 API 호출에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage || '네이버 검색 API 호출 중 오류가 발생했습니다.',
      }));
      console.error(err);
    }
  };

  const getSearchTrend = async (options: NaverDatalabOptions) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/naver/datalab', options);

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          datalabResults: response.data,
        }));
      } else {
        throw new Error(response.data.error || '네이버 데이터랩 API 호출에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage || '네이버 데이터랩 API 호출 중 오류가 발생했습니다.',
      }));
      console.error(err);
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

  return {
    ...state,
    searchBlogs,
    getSearchTrend,
    clearResults,
  };
};
