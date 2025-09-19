'use client';

import { useState } from 'react';
import axios from 'axios';

interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

interface IntegratedData {
  query: string;
  crawlingData: {
    keywords: ScrapedKeyword[];
    total: number;
  };
  naverApiData: {
    searchResults: number;
    trendData: number;
    relatedKeywords: number;
  };
  lastUpdated: string;
}

interface IntegratedDataState {
  loading: boolean;
  data: IntegratedData | null;
  error: string | null;
}

export const useIntegratedData = () => {
  const [state, setState] = useState<IntegratedDataState>({
    loading: false,
    data: null,
    error: null,
  });

  const getIntegratedData = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(`http://localhost:3001/api/naver/integrated-data/${encodeURIComponent(query)}`, {
        timeout: 30000, // 30초 타임아웃
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.data.success) {
        console.log('🔄 [통합 데이터 API] 응답 데이터:', {
          query,
          success: response.data.success,
          hasCrawlingData: !!response.data.data?.crawlingData,
          crawlingKeywordsCount: response.data.data?.crawlingData?.total || 0,
          hasNaverApiData: !!response.data.data?.naverApiData,
          lastUpdated: response.data.data?.lastUpdated,
          fullResponse: response.data
        });
        console.log('📋 [통합 데이터 API] 크롤링 키워드 상세:', response.data.data?.crawlingData?.keywords);
        console.log('🌐 [통합 데이터 API] 네이버 API 데이터:', response.data.data?.naverApiData);
        
        setState(prev => {
          const newState = {
            ...prev,
            loading: false,
            data: response.data.data,
          };
          console.log('✅ [통합 데이터 API] 상태 업데이트 완료:', {
            previousState: prev,
            newState,
            responseData: response.data.data
          });
          return newState;
        });
        
        return response.data.data;
      } else {
        console.error('❌ [통합 데이터 API] 실패:', response.data);
        throw new Error(response.data.error || '통합 데이터 조회 실패');
      }
    } catch (err) {
      let errorMessage = '통합 데이터 조회 중 오류가 발생했습니다.';
      
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

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    console.log('🧹 [통합 데이터] 이전 데이터 초기화');
    setState({
      loading: false,
      data: null,
      error: null,
    });
  };

  return {
    ...state,
    getIntegratedData,
    reset,
  };
};
