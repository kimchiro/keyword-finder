import { useState, useCallback } from 'react';
import { executeWorkflow, checkWorkflowHealth } from '@/commons/apis';
import type { WorkflowResponse, WorkflowHealthResponse } from '@/commons/types';

/**
 * 워크플로우 상태 타입
 */
export interface WorkflowState {
  loading: boolean;
  data: WorkflowResponse | null;
  error: string | null;
  health: WorkflowHealthResponse | null;
  healthLoading: boolean;
  healthError: string | null;
}

/**
 * 워크플로우 상태 관리 훅
 * 키워드 분석 워크플로우 실행과 상태 체크를 관리합니다.
 */
export const useWorkflow = () => {
  const [state, setState] = useState<WorkflowState>({
    loading: false,
    data: null,
    error: null,
    health: null,
    healthLoading: false,
    healthError: null,
  });

  /**
   * 워크플로우 실행
   */
  const runWorkflow = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        error: '분석할 키워드를 입력해주세요.',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      data: null,
    }));

    try {
      console.log('🚀 [워크플로우 훅] 실행 시작:', query);
      const result = await executeWorkflow(query);
      
      setState(prev => ({
        ...prev,
        loading: false,
        data: result,
        error: null,
      }));

      console.log('✅ [워크플로우 훅] 실행 완료:', {
        query,
        success: result.success,
        executionTime: result.data?.executionTime,
        hasAnalysisData: !!result.data?.analysisData,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '워크플로우 실행 중 오류가 발생했습니다.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      console.error('❌ [워크플로우 훅] 실행 실패:', error);
      throw error;
    }
  }, []);

  /**
   * 워크플로우 상태 체크
   */
  const checkHealth = useCallback(async () => {
    setState(prev => ({
      ...prev,
      healthLoading: true,
      healthError: null,
    }));

    try {
      console.log('🏥 [워크플로우 훅] 상태 체크 시작');
      const result = await checkWorkflowHealth();
      
      setState(prev => ({
        ...prev,
        healthLoading: false,
        health: result,
        healthError: null,
      }));

      console.log('✅ [워크플로우 훅] 상태 체크 완료:', {
        success: result.success,
        overall: result.data?.overall,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '워크플로우 상태 확인 중 오류가 발생했습니다.';
      
      setState(prev => ({
        ...prev,
        healthLoading: false,
        healthError: errorMessage,
      }));

      console.error('❌ [워크플로우 훅] 상태 체크 실패:', error);
      throw error;
    }
  }, []);

  /**
   * 상태 초기화
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
      health: null,
      healthLoading: false,
      healthError: null,
    });
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      healthError: null,
    }));
  }, []);

  return {
    // 상태
    ...state,
    
    // 액션
    runWorkflow,
    checkHealth,
    reset,
    clearError,
    
    // 편의 속성
    isLoading: state.loading || state.healthLoading,
    hasData: !!state.data,
    hasError: !!state.error || !!state.healthError,
    isHealthy: state.health?.data?.overall === true,
  };
};