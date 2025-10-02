import axios from 'axios';
import type { ScrapingOptions, ScrapingResult } from '@/commons/types';

/**
 * 키워드 스크래핑 API 함수
 * @param query 검색할 키워드
 * @param options 스크래핑 옵션
 * @returns 스크래핑 결과
 */
export const scrapeKeywords = async (
  query: string, 
  options: ScrapingOptions = {}
): Promise<ScrapingResult> => {
  if (!query.trim()) {
    throw new Error('검색 키워드를 입력해주세요.');
  }

  try {
    const API_BASE_URL = '/api';
    const response = await axios.post(`${API_BASE_URL}/scraping/scrape`, {
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
    
    console.error('❌ [키워드 스크래핑] 오류:', err);
    throw new Error(errorMessage);
  }
};
