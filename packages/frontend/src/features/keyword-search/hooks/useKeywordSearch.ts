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
    if (!query.trim()) return Promise.resolve();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      results: null,
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/scraping/scrape', {
        query,
        options: {
          headless: options.headless ?? true,
          maxPagesPerModule: options.maxPagesPerModule ?? 2,
          saveToDb: options.saveToDb ?? true,
        },
      }, {
        timeout: 60000, // 60초 타임아웃 (스크래핑은 시간이 오래 걸릴 수 있음)
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🕷️ [키워드 스크래핑 API] 응답 데이터:', {
        query,
        success: response.data.success,
        keywordCount: response.data.keywords?.length || 0,
        options: {
          headless: options.headless ?? true,
          maxPagesPerModule: options.maxPagesPerModule ?? 2,
          saveToDb: options.saveToDb ?? true,
        },
        fullResponse: response.data
      });
      console.log('📝 [키워드 스크래핑 API] 수집된 키워드 상세:', response.data.keywords);
      
      if (response.data.success) {
        setState(prev => {
          const newState = {
            ...prev,
            loading: false,
            results: response.data,
          };
          console.log('✅ [키워드 스크래핑] 상태 업데이트 완료:', {
            previousState: prev,
            newState,
            responseData: response.data
          });
          return newState;
        });
        return response.data;
      } else {
        console.error('❌ [키워드 스크래핑 API] 실패:', response.data);
        throw new Error(response.data.error || '스크래핑에 실패했습니다.');
      }
    } catch (err) {
      let errorMessage = '키워드 수집 중 오류가 발생했습니다.';
      
      if (err && typeof err === 'object') {
        if ('response' in err) {
          const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
          if (axiosError.response?.status === 404) {
            errorMessage = 'API 엔드포인트를 찾을 수 없습니다. 백엔드 서버 설정을 확인하세요.';
          } else if (axiosError.response?.status === 500) {
            errorMessage = '서버 내부 오류가 발생했습니다.';
          } else {
            errorMessage = axiosError.response?.data?.error || errorMessage;
          }
        } else if ('code' in err) {
          const networkError = err as { code: string };
          if (networkError.code === 'ECONNREFUSED') {
            errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.';
          } else if (networkError.code === 'ENOTFOUND') {
            errorMessage = '네트워크 연결을 확인하세요.';
          } else if (networkError.code === 'ETIMEDOUT') {
            errorMessage = '요청 시간이 초과되었습니다. 잠시 후 다시 시도하세요.';
          }
        } else if ('message' in err) {
          errorMessage = (err as { message: string }).message;
        }
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('❌ [키워드 스크래핑] 오류:', err);
      throw new Error(errorMessage);
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
