import { useState } from 'react';
import { useDashboard } from './useDashboard';
import { useKeywordModal } from './useKeywordModal';
import { useToast } from './useToast';
import { useNaverDashboard } from './useNaverDashboard';
import { useIntegratedData } from './useIntegratedData';

export const useDashboardPage = () => {
  const { loading, data, error, refreshData } = useDashboard();
  const { 
    isModalOpen, 
    selectedQuery, 
    keywords, 
    openModal, 
    closeModal 
  } = useKeywordModal();
  const { isVisible, message, showToast, hideToast } = useToast();
  const { 
    loading: naverLoading, 
    searchData, 
    trendData, 
    currentQuery, 
    error: naverError, 
    searchAndAnalyze
  } = useNaverDashboard();
  
  const {
    data: integratedData,
    error: integratedError,
    fetchIntegratedData
  } = useIntegratedData();

  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryClick = (query: string) => {
    openModal(query);
    // 통합 데이터 조회 (크롤링 + 네이버 API)
    fetchIntegratedData(query);
    // 네이버 API로 해당 쿼리 분석 (백업)
    searchAndAnalyze(query);
  };

  const handleCopy = () => {
    showToast('키워드가 복사되었습니다!');
  };

  const handleNaverSearch = () => {
    if (searchQuery.trim()) {
      // 통합 데이터 조회 (우선순위 1)
      fetchIntegratedData(searchQuery.trim());
      // 네이버 API 분석 (우선순위 2)
      searchAndAnalyze(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNaverSearch();
    }
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    
    // Dashboard data
    loading,
    data,
    error,
    refreshData,
    
    // Modal
    isModalOpen,
    selectedQuery,
    keywords,
    closeModal,
    
    // Toast
    isVisible,
    message,
    hideToast,
    
    // Naver data
    naverLoading,
    searchData,
    trendData,
    currentQuery,
    naverError,
    
    // Integrated data
    integratedData,
    integratedError,
    
    // Handlers
    handleQueryClick,
    handleCopy,
    handleNaverSearch,
    handleKeyPress,
  };
};
