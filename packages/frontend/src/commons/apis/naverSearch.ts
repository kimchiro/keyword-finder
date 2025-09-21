import axios from 'axios';
import type { 
  NaverSearchOptions, 
  NaverDatalabOptions, 
  NaverSearchApiResponse, 
  NaverDatalabApiResponse 
} from '@/commons/types';

/**
 * 네이버 블로그 검색 API 함수
 * @param query 검색 키워드
 * @param options 검색 옵션
 * @returns 블로그 검색 결과
 */
export const searchNaverBlogs = async (
  query: string, 
  options: NaverSearchOptions = {}
): Promise<NaverSearchApiResponse> => {
  if (!query.trim()) {
    throw new Error('검색 키워드를 입력해주세요.');
  }

  try {
    const response = await axios.get('/api/naver/blog-search', {
      params: {
        query,
        display: options.display || 10,
        start: options.start || 1,
        sort: options.sort || 'sim',
      },
      timeout: 10000,
    });

    console.log('🔍 [네이버 블로그 검색 API] 응답 데이터:', {
      query,
      success: response.data.success,
      itemCount: response.data.data?.items?.length || 0,
      options,
      fullResponse: response.data
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || '네이버 블로그 검색에 실패했습니다.');
    }
  } catch (err) {
    let errorMessage = '네이버 블로그 검색 중 오류가 발생했습니다.';
    
    if (err && typeof err === 'object') {
      if ('response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 429) {
          errorMessage = 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'API 인증에 실패했습니다. API 키를 확인하세요.';
        } else {
          errorMessage = axiosError.response?.data?.error || errorMessage;
        }
      } else if ('message' in err) {
        errorMessage = (err as { message: string }).message;
      }
    }

    console.error('❌ [네이버 블로그 검색] 오류:', err);
    throw new Error(errorMessage);
  }
};

/**
 * 네이버 데이터랩 트렌드 API 함수
 * @param options 데이터랩 옵션
 * @returns 트렌드 분석 결과
 */
export const getNaverTrend = async (
  options: NaverDatalabOptions
): Promise<NaverDatalabApiResponse> => {
  try {
    const response = await axios.post('/api/naver/datalab', options, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 [네이버 데이터랩 API] 응답 데이터:', {
      options,
      success: response.data.success,
      resultCount: response.data.data?.results?.length || 0,
      fullResponse: response.data
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || '네이버 데이터랩 조회에 실패했습니다.');
    }
  } catch (err) {
    let errorMessage = '네이버 데이터랩 조회 중 오류가 발생했습니다.';
    
    if (err && typeof err === 'object') {
      if ('response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 429) {
          errorMessage = 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도하세요.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'API 인증에 실패했습니다. API 키를 확인하세요.';
        } else {
          errorMessage = axiosError.response?.data?.error || errorMessage;
        }
      } else if ('message' in err) {
        errorMessage = (err as { message: string }).message;
      }
    }

    console.error('❌ [네이버 데이터랩] 오류:', err);
    throw new Error(errorMessage);
  }
};
