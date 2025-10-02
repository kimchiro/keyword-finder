import axios from 'axios';
import type { WorkflowResponse, WorkflowHealthResponse } from '@/commons/types';

const API_BASE_URL = '/api';

/**
 * 키워드 분석 워크플로우 실행 API 함수
 * @param query 분석할 키워드
 * @returns 워크플로우 실행 결과
 */
export const executeWorkflow = async (query: string): Promise<WorkflowResponse> => {
  if (!query.trim()) {
    throw new Error('분석할 키워드를 입력해주세요.');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/workflow/complete/${encodeURIComponent(query.trim())}`, {}, {
      timeout: 120000, // 2분 타임아웃 (워크플로우는 시간이 오래 걸릴 수 있음)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 [워크플로우 API] 실행 완료:', {
      query,
      success: response.data.success,
      executionTime: response.data.data?.executionTime,
      hasAnalysisData: !!response.data.data?.analysisData,
      scrapingKeywordCount: response.data.data?.scrapingData?.keywords?.length || 0,
      topKeywordsCount: response.data.data?.topKeywords?.length || 0,
      fullResponse: response.data
    });

    if (response.data.success) {
      return response.data;
    } else {
      console.error('❌ [워크플로우 API] 실패:', response.data);
      throw new Error(response.data.message || '워크플로우 실행에 실패했습니다.');
    }
  } catch (err) {
    let errorMessage = '워크플로우 실행 중 오류가 발생했습니다.';
    
    if (err && typeof err === 'object') {
      if ('response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          errorMessage = 'API 엔드포인트를 찾을 수 없습니다. 백엔드 서버 설정을 확인하세요.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = '서버 내부 오류가 발생했습니다.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
      } else if ('code' in err) {
        const networkError = err as { code: string };
        if (networkError.code === 'ECONNREFUSED') {
          errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.';
        } else if (networkError.code === 'ETIMEDOUT') {
          errorMessage = '요청 시간이 초과되었습니다. 잠시 후 다시 시도하세요.';
        }
      } else if ('message' in err) {
        errorMessage = (err as { message: string }).message;
      }
    }

    console.error('❌ [워크플로우] 오류:', err);
    throw new Error(errorMessage);
  }
};

/**
 * 워크플로우 상태 체크 API 함수
 * @returns 워크플로우 상태 정보
 */
export const checkWorkflowHealth = async (): Promise<WorkflowHealthResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workflow/health`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('🏥 [워크플로우 상태] 체크 완료:', {
      success: response.data.success,
      overall: response.data.data?.overall,
      services: response.data.data,
      fullResponse: response.data
    });

    return response.data;
  } catch (err) {
    let errorMessage = '워크플로우 상태 확인 중 오류가 발생했습니다.';
    
    if (err && typeof err === 'object') {
      if ('response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          errorMessage = '상태 체크 API를 찾을 수 없습니다.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = '서버 내부 오류가 발생했습니다.';
        } else {
          errorMessage = axiosError.response?.data?.message || errorMessage;
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

    console.error('❌ [워크플로우 상태] 오류:', err);
    throw new Error(errorMessage);
  }
};