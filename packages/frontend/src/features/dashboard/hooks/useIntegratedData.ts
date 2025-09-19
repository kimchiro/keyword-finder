import { useState, useCallback } from 'react';
import axios from 'axios';
import { IntegratedKeywordData } from '../../../shared/types';


interface IntegratedDataState {
  loading: boolean;
  data: IntegratedKeywordData | null;
  error: string | null;
}

export const useIntegratedData = () => {
  const [state, setState] = useState<IntegratedDataState>({
    loading: false,
    data: null,
    error: null,
  });

  const fetchIntegratedData = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.get(`http://localhost:3001/api/integrated-keyword-data/${encodeURIComponent(query)}`);

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          data: response.data.data,
        }));
      } else {
        throw new Error(response.data.error || '통합 데이터 조회에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage || '통합 데이터 조회 중 오류가 발생했습니다.',
      }));
      console.error('통합 데이터 조회 오류:', err);
    }
  }, []);

  const fetchNaverSearchFromDb = useCallback(async (query: string, limit = 10) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/naver/search-results/${encodeURIComponent(query)}?limit=${limit}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('DB에서 네이버 검색 결과 조회 오류:', error);
      return null;
    }
  }, []);

  const fetchNaverTrendFromDb = useCallback(async (query: string, options: { device?: string; gender?: string; ageGroup?: string } = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.device) params.append('device', options.device);
      if (options.gender) params.append('gender', options.gender);
      if (options.ageGroup) params.append('ageGroup', options.ageGroup);
      
      const url = `http://localhost:3001/api/naver/trend-data/${encodeURIComponent(query)}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url);
      
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('DB에서 네이버 트렌드 데이터 조회 오류:', error);
      return null;
    }
  }, []);

  const clearData = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchIntegratedData,
    fetchNaverSearchFromDb,
    fetchNaverTrendFromDb,
    clearData,
  };
};
