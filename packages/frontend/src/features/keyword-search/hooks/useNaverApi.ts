import { useState } from 'react';
import axios from 'axios';
import { 
  NaverSearchApiResponse, 
  NaverDatalabApiResponse, 
  NaverSearchOptions, 
  NaverDatalabOptions 
} from '../../../shared/types';

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
      searchResults: null, // 새 검색 시 이전 결과 즉시 제거
    }));

    try {
      // 백엔드 서버 연결 확인
      const healthCheck = await axios.get('http://localhost:3001/health', {
        timeout: 5000,
      });
      
      if (healthCheck.status !== 200) {
        throw new Error('백엔드 서버가 응답하지 않습니다.');
      }

      const response = await axios.post('http://localhost:3001/api/naver/search', {
        query,
        display: options.display || 10,
        start: options.start || 1,
        sort: options.sort || 'sim',
      }, {
        timeout: 30000, // 30초 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log('🔍 [네이버 검색 API] 응답 데이터:', {
          query,
          success: response.data.success,
          total: response.data.data?.total,
          itemCount: response.data.data?.items?.length,
          fullResponse: response.data
        });
        console.log('📝 [네이버 검색 API] 검색 결과 상세:', response.data.data?.items);
        
        setState(prev => {
          const newState = {
            ...prev,
            loading: false,
            searchResults: response.data,
          };
          console.log('✅ [네이버 검색 API] 상태 업데이트 완료:', {
            previousState: prev,
            newState,
            responseData: response.data
          });
          return newState;
        });
      } else {
        console.error('❌ [네이버 검색 API] 실패:', response.data);
        throw new Error(response.data.error || '네이버 검색 API 호출에 실패했습니다.');
      }
    } catch (err: unknown) {
      let errorMessage = '네이버 검색 API 호출 중 오류가 발생했습니다.';
      
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
      console.error('❌ [네이버 검색 API] 상세 오류:', {
        error: err,
        message: errorMessage,
        query,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getSearchTrend = async (options: NaverDatalabOptions) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      datalabResults: null, // 새 검색 시 이전 결과 즉시 제거
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/naver/datalab', options, {
        timeout: 30000, // 30초 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log('📊 [네이버 데이터랩 API] 응답 데이터:', {
          keywordGroups: options.keywordGroups,
          timeUnit: options.timeUnit,
          dateRange: `${options.startDate} ~ ${options.endDate}`,
          success: response.data.success,
          resultCount: response.data.data?.results?.length,
          fullResponse: response.data
        });
        console.log('📈 [네이버 데이터랩 API] 트렌드 데이터 상세:', response.data.data?.results);
        
        setState(prev => {
          const newState = {
            ...prev,
            loading: false,
            datalabResults: response.data,
          };
          console.log('✅ [네이버 데이터랩 API] 상태 업데이트 완료:', {
            previousState: prev,
            newState,
            responseData: response.data
          });
          return newState;
        });
      } else {
        console.error('❌ [네이버 데이터랩 API] 실패:', response.data);
        throw new Error(response.data.error || '네이버 데이터랩 API 호출에 실패했습니다.');
      }
    } catch (err: unknown) {
      let errorMessage = '네이버 데이터랩 API 호출 중 오류가 발생했습니다.';
      
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
      console.error('❌ [네이버 데이터랩 API] 상세 오류:', {
        error: err,
        message: errorMessage,
        options,
        timestamp: new Date().toISOString()
      });
    }
  };

  const clearResults = () => {
    console.log('🧹 [네이버 API] 이전 결과 초기화');
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
