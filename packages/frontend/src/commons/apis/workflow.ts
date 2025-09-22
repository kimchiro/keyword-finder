import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// API 에러 처리 헬퍼 함수
const handleApiError = (error: unknown, operation: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error(`❌ ${operation} 실패:`, {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
      url: axiosError.config?.url,
    });
    
    // 서버에서 반환한 에러 메시지가 있으면 사용
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const errorData = axiosError.response.data as { message?: string; error?: string };
      if (errorData.message) {
        throw new Error(`${operation} 실패: ${errorData.message}`);
      }
      if (errorData.error) {
        throw new Error(`${operation} 실패: ${errorData.error}`);
      }
    }
    
    // HTTP 상태 코드별 처리
    switch (axiosError.response?.status) {
      case 500:
        throw new Error(`${operation} 실패: 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`);
      case 404:
        throw new Error(`${operation} 실패: API 엔드포인트를 찾을 수 없습니다.`);
      case 400:
        throw new Error(`${operation} 실패: 잘못된 요청입니다.`);
      case 429:
        throw new Error(`${operation} 실패: 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.`);
      default:
        throw new Error(`${operation} 실패: ${axiosError.message}`);
    }
  }
  
  // 네트워크 에러 등 기타 에러
  throw new Error(`${operation} 실패: ${error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}`);
};

/**
 * 완전한 키워드 분석 워크플로우 실행
 * 네이버 API + 스크래핑 + 키워드 분석을 병렬로 수행
 */
export const runCompleteWorkflow = async (query: string) => {
  try {
    console.log(`🚀 완전한 워크플로우 시작: ${query}`);
    const response = await axios.post(
      `${API_BASE_URL}/workflow/complete/${encodeURIComponent(query)}`,
      {},
      {
        timeout: 120000, // 2분 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ 완전한 워크플로우 성공: ${query}`);
    return response.data;
  } catch (error) {
    handleApiError(error, '완전한 워크플로우');
  }
};

/**
 * 빠른 키워드 분석 워크플로우 실행
 * 네이버 API + 기존 분석 데이터 조회
 */
export const runQuickWorkflow = async (query: string) => {
  try {
    console.log(`⚡ 빠른 워크플로우 시작: ${query}`);
    const response = await axios.post(
      `${API_BASE_URL}/workflow/quick/${encodeURIComponent(query)}`,
      {},
      {
        timeout: 60000, // 1분 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ 빠른 워크플로우 성공: ${query}`);
    return response.data;
  } catch (error) {
    handleApiError(error, '빠른 워크플로우');
  }
};

/**
 * 스크래핑 전용 워크플로우 실행
 * 키워드 스크래핑만 수행
 */
export const runScrapingWorkflow = async (query: string) => {
  try {
    console.log(`🕷️ 스크래핑 워크플로우 시작: ${query}`);
    const response = await axios.post(
      `${API_BASE_URL}/workflow/scraping/${encodeURIComponent(query)}`,
      {},
      {
        timeout: 90000, // 1.5분 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ 스크래핑 워크플로우 성공: ${query}`);
    return response.data;
  } catch (error) {
    handleApiError(error, '스크래핑 워크플로우');
  }
};

/**
 * 워크플로우 상태 체크
 */
export const getWorkflowHealth = async () => {
  try {
    console.log(`🔍 워크플로우 상태 체크 시작`);
    const response = await axios.get(`${API_BASE_URL}/workflow/health`, {
      timeout: 10000, // 10초 타임아웃
    });
    console.log(`✅ 워크플로우 상태 체크 성공`);
    return response.data;
  } catch (error) {
    handleApiError(error, '워크플로우 상태 체크');
  }
};
