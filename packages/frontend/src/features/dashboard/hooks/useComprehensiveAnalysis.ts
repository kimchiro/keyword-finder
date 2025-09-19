import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { ComprehensiveKeywordAnalysis } from '../../../shared/types';

interface ComprehensiveAnalysisState {
  loading: boolean;
  data: ComprehensiveKeywordAnalysis | null;
  error: string | null;
}

export const useComprehensiveAnalysis = () => {
  const [state, setState] = useState<ComprehensiveAnalysisState>({
    loading: false,
    data: null,
    error: null,
  });
  
  const currentRequest = useRef<string | null>(null);

  const analyzeKeyword = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return;
    
    // 이미 같은 키워드로 요청 중이면 무시
    if (currentRequest.current === keyword.trim()) {
      console.log(`⚠️ 중복 요청 무시: ${keyword}`);
      return;
    }
    
    currentRequest.current = keyword.trim();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axios.post('http://localhost:3001/api/naver/comprehensive-analysis', {
        keyword: keyword.trim(),
      });

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          data: response.data.data,
        }));
        console.log(`✅ 키워드 분석 완료: ${keyword}`);
      } else {
        throw new Error(response.data.error || '키워드 분석에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage || '키워드 분석 중 오류가 발생했습니다.',
      }));
      console.error('키워드 분석 오류:', err);
    } finally {
      // 요청 완료 후 currentRequest 초기화
      currentRequest.current = null;
    }
  }, []); // 빈 의존성 배열로 함수 메모이제이션

  const clearData = () => {
    setState({
      loading: false,
      data: null,
      error: null,
    });
  };

  return {
    ...state,
    analyzeKeyword,
    clearData,
  };
};
