import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

/**
 * 키워드 분석 데이터 조회 API 함수
 * @param query 검색 키워드
 * @returns 키워드 분석 데이터 결과
 */
export const getIntegratedKeywordData = async (query: string) => {
  if (!query.trim()) {
    throw new Error('검색 키워드를 입력해주세요.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/keyword-analysis/analysis/${encodeURIComponent(query)}`, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 [키워드 분석 API] 요청 완료:', {
      query,
      url: `${API_BASE_URL}/keyword-analysis/analysis/${encodeURIComponent(query)}`,
      status: response.status,
      success: response.data.success,
      fullResponse: response.data
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      console.error('❌ [키워드 분석 API] 실패:', response.data);
      throw new Error(response.data.error || '키워드 분석 데이터 조회 실패');
    }
  } catch (err) {
    let errorMessage = '통합 데이터 조회 중 오류가 발생했습니다.';
    
    if (err && typeof err === 'object') {
      if ('response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 404) {
          errorMessage = '요청한 데이터를 찾을 수 없습니다.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = '서버 내부 오류가 발생했습니다.';
        } else {
          errorMessage = axiosError.response?.data?.error || errorMessage;
        }
      } else if ('code' in err) {
        const networkError = err as { code: string };
        if (networkError.code === 'ECONNREFUSED') {
          errorMessage = '백엔드 서버에 연결할 수 없습니다.';
        } else if (networkError.code === 'ETIMEDOUT') {
          errorMessage = '요청 시간이 초과되었습니다.';
        }
      } else if ('message' in err) {
        errorMessage = (err as { message: string }).message;
      }
    }

    console.error('❌ [통합 데이터] 오류:', err);
    throw new Error(errorMessage);
  }
};
