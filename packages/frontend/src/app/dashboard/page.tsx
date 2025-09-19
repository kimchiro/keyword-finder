'use client';

import React from 'react';
import { 
  useDashboardPage,
  StatsCards,
  RecentSearches,
  TopKeywords,
  KeywordModal,
  Toast,
  DashboardHeader,
  NaverResultsDisplay,
  IntegratedDataDisplay,
  Container,
  ContentGrid,
  LoadingSpinner,
  ErrorMessage
} from '@/features/dashboard';
import { ErrorContainer } from '@/features/dashboard/styles/SearchBarStyles';

export default function Dashboard() {
  const {
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
  } = useDashboardPage();

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <ErrorMessage>데이터를 불러올 수 없습니다.</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      {/* <DashboardHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onKeyPress={handleKeyPress}
        onNaverSearch={handleNaverSearch}
        onRefresh={refreshData}
        naverLoading={naverLoading}
        loading={loading}
      /> */}

      <StatsCards stats={data.stats} />

      <ContentGrid>
        <RecentSearches 
          recentSearches={data.recentSearches} 
          onQueryClick={handleQueryClick}
        />
        <TopKeywords topKeywords={data.stats.topKeywords} />
      </ContentGrid>

      {/* 통합 데이터 표시 */}
      {integratedData && (
        <IntegratedDataDisplay data={integratedData} />
      )}

      {integratedError && (
        <ErrorContainer>
          <ErrorMessage>통합 데이터 조회 오류: {integratedError}</ErrorMessage>
        </ErrorContainer>
      )}

      {/* 네이버 API 결과 표시 */}
      <NaverResultsDisplay
        searchData={searchData}
        trendData={trendData}
        currentQuery={currentQuery || undefined}
      />

      {naverError && (
        <ErrorContainer>
          <ErrorMessage>{naverError}</ErrorMessage>
        </ErrorContainer>
      )}

      <KeywordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        query={selectedQuery}
        keywords={keywords}
        onCopy={handleCopy}
      />

      <Toast
        isVisible={isVisible}
        message={message}
        onClose={hideToast}
      />
    </Container>
  );
}