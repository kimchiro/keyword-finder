import { useState, useCallback } from 'react';
import { runCompleteWorkflow, runQuickWorkflow, runScrapingWorkflow, getWorkflowHealth } from '@/commons/apis';
import { WorkflowResponse, WorkflowHealthResponse } from '@/commons/types';

interface WorkflowState {
  loading: boolean;
  data: WorkflowResponse['data'] | null;
  error: string | null;
  health: WorkflowHealthResponse['data'] | null;
}

export const useWorkflow = () => {
  const [state, setState] = useState<WorkflowState>({
    loading: false,
    data: null,
    error: null,
    health: null,
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
      health: null,
    });
  }, []);

  const runComplete = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log(`🚀 useWorkflow: 완전한 워크플로우 시작 - ${query}`);
      const response = await runCompleteWorkflow(query);
      
      console.log(`📊 useWorkflow: API 응답 받음`, { 
        success: response?.success, 
        hasData: !!response?.data,
        message: response?.message 
      });
      
      if (response && response.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          data: response.data,
          error: null 
        }));
        console.log(`✅ useWorkflow: 완전한 워크플로우 성공 - ${query}`);
        return response.data;
      } else {
        const errorMsg = response?.message || '워크플로우 실행 중 오류가 발생했습니다.';
        console.error(`❌ useWorkflow: API 응답 실패`, { response, errorMsg });
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '워크플로우 실행 실패';
      console.error(`❌ useWorkflow: 완전한 워크플로우 실패 - ${query}:`, error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const runQuick = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await runQuickWorkflow(query);
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          data: response.data,
          error: null 
        }));
        return response.data;
      } else {
        throw new Error(response.message || '빠른 워크플로우 실행 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '빠른 워크플로우 실행 실패';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const runScrapingOnly = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await runScrapingWorkflow(query);
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          data: response.data,
          error: null 
        }));
        return response.data;
      } else {
        throw new Error(response.message || '스크래핑 워크플로우 실행 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '스크래핑 워크플로우 실행 실패';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const response = await getWorkflowHealth();
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          health: response.data 
        }));
        return response.data;
      } else {
        throw new Error(response.message || '워크플로우 상태 확인 실패');
      }
    } catch (error) {
      console.error('워크플로우 상태 확인 오류:', error);
      return null;
    }
  }, []);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    health: state.health,
    runComplete,
    runQuick,
    runScrapingOnly,
    checkHealth,
    reset: resetState,
  };
};
