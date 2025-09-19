'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useKeywordModal } from '@/features/dashboard/hooks/useKeywordModal';
import { useToast } from '@/features/dashboard/hooks/useToast';
import { useNaverDashboard } from '@/features/dashboard/hooks/useNaverDashboard';
import { useIntegratedData } from '@/features/dashboard/hooks/useIntegratedData';
import { StatsCards } from '@/features/dashboard/components/StatsCards';
import { RecentSearches } from '@/features/dashboard/components/RecentSearches';
import { TopKeywords } from '@/features/dashboard/components/TopKeywords';
import { KeywordModal } from '@/features/dashboard/components/KeywordModal';
import { Toast } from '@/features/dashboard/components/Toast';
import { NaverTrendChart } from '@/features/dashboard/components/NaverTrendChart';
import { NaverSearchCard } from '@/features/dashboard/components/NaverSearchCard';

import { 
  Container, 
  Header, 
  Title, 
  RefreshButton, 
  ContentGrid, 
  LoadingSpinner, 
  ErrorMessage 
} from '@/features/dashboard/styles/DashboardStyles';
import {
  SearchBarContainer,
  SearchInput,
  SearchButton,
  NaverResultsContainer,
  ErrorContainer
} from '@/features/dashboard/styles/SearchBarStyles';

export default function Dashboard() {
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
      <Header>
        <Title>대시보드</Title>
        <SearchBarContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="네이버 검색 분석..."
            onKeyPress={handleKeyPress}
            disabled={naverLoading}
          />
          <SearchButton
            onClick={handleNaverSearch}
            disabled={naverLoading || !searchQuery.trim()}
            loading={naverLoading}
          >
            {naverLoading ? '분석 중...' : '네이버 분석'}
          </SearchButton>
          <RefreshButton onClick={refreshData} disabled={loading}>
            새로고침
          </RefreshButton>
        </SearchBarContainer>
      </Header>

      <StatsCards stats={data.stats} />

      <ContentGrid>
        <RecentSearches 
          recentSearches={data.recentSearches} 
          onQueryClick={handleQueryClick}
        />
        <TopKeywords topKeywords={data.stats.topKeywords} />
      </ContentGrid>

      {/* 통합 데이터 표시 (크롤링 + 네이버 API) */}
      {integratedData && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            🔍 통합 키워드 분석: &ldquo;{integratedData.query}&rdquo;
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* 크롤링 데이터 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#4a5568' }}>
                📊 크롤링 키워드 ({integratedData.crawlingData.length}개)
              </h3>
              {integratedData.crawlingData.slice(0, 10).map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: index < 9 ? '1px solid #e2e8f0' : 'none'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{item.text}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#718096' }}>
                    <span>{item.keyword_type}</span>
                    <span>#{item.rank}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 네이버 검색 결과 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#4a5568' }}>
                🔍 네이버 검색 결과 ({integratedData.naverApiData.searchResults.length}개)
              </h3>
              {integratedData.naverApiData.searchResults.slice(0, 5).map((item, index) => (
                <div key={item.id} style={{
                  padding: '0.75rem 0',
                  borderBottom: index < 4 ? '1px solid #e2e8f0' : 'none'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {item.title.replace(/<[^>]*>/g, '')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    {item.bloggername} • {item.postdate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 네이버 트렌드 데이터 */}
          {integratedData.naverApiData.trendData.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#4a5568' }}>
                📈 검색 트렌드 ({integratedData.naverApiData.trendData.length}개 데이터 포인트)
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {integratedData.naverApiData.trendData.slice(0, 12).map((item) => (
                  <div key={item.id} style={{
                    padding: '0.5rem 1rem',
                    background: '#f7fafc',
                    borderRadius: '20px',
                    fontSize: '0.875rem'
                  }}>
                    {item.period}: {item.ratio}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 연관 키워드 */}
          {integratedData.naverApiData.relatedKeywords.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#4a5568' }}>
                🔗 연관 키워드 ({integratedData.naverApiData.relatedKeywords.length}개)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {integratedData.naverApiData.relatedKeywords.slice(0, 8).map((item) => (
                  <div key={item.id} style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      {item.related_keyword}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                      PC: {item.monthly_pc_qc_cnt.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                      Mobile: {item.monthly_mobile_qc_cnt.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {integratedError && (
        <ErrorContainer>
          <ErrorMessage>통합 데이터 조회 오류: {integratedError}</ErrorMessage>
        </ErrorContainer>
      )}

      {/* 네이버 API 결과 표시 */}
      {(searchData || trendData) && (
        <NaverResultsContainer>
          <NaverTrendChart trendData={trendData} query={currentQuery || undefined} />
          <NaverSearchCard searchData={searchData} query={currentQuery || undefined} />
        </NaverResultsContainer>
      )}

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
