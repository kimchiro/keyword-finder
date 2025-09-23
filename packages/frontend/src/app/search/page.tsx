'use client';

import React from 'react';
import { SearchForm } from '@/commons/components';
import { BlogSearchResults } from '@/components/BlogSearchResults';
import { KeywordAnalytics } from '@/components/KeywordAnalytics';
import { MonthlyVolume } from '@/components/MonthlyVolume';
import { SearchTrendChart } from '@/components/SearchTrendChart';
import { MonthlyRatioChart } from '@/components/MonthlyRatioChart';
import { SmartBlock } from '@/components/SmartBlock';
import { RelatedKeywords } from '@/components/RelatedKeywords';
import { UnifiedDataTable } from '@/components/UnifiedDataTable';
import { useWorkflow } from '@/commons/hooks';
import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';
import Loading, { EmptyState } from './loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.lg};
`;

const Card = styled.div`
  background: ${colors.bgCard};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadow.md};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.xl};
  border: 1px solid ${colors.borderPrimary};
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


const Title = styled.h1`
  ${fontStyles.heading}
  margin-bottom: ${spacing.xl};
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: ${colors.dangerLight}22;
  border: 1px solid ${colors.dangerLight};
  color: ${colors.danger};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin: ${spacing.md} 0;
  font-size: ${fontSize.sm};
  line-height: 1.5;
  
  strong {
    display: block;
    margin-bottom: ${spacing.sm};
    font-weight: ${fontWeight.semibold};
  }
  
  .error-details {
    font-size: ${fontSize.xs};
    color: ${colors.dangerDark};
    margin-top: ${spacing.sm};
    padding-top: ${spacing.sm};
    border-top: 1px solid ${colors.dangerLight}44;
  }
`;

export default function SearchPage() {
  const {
    loading,
    data: workflowData,
    error,
    runWorkflow,
    reset
  } = useWorkflow();

  const handleSearch = async (query: string) => {
    console.log(`🔍 SearchPage: 검색 시작 - "${query}"`);
    reset();
    try {
      const result = await runWorkflow(query);
      console.log(`✅ SearchPage: 검색 완료 - "${query}"`, result);
    } catch (error) {
      console.error(`❌ SearchPage: 검색 실패 - "${query}":`, error);
      // 에러는 이미 useWorkflow에서 상태로 관리되므로 추가 처리 불필요
    }
  };

  return (
    <Container>
      <Card>
        <Title>네이버 키워드 파인더</Title>
        
        <SearchForm 
          onNaverSearch={handleSearch}
          loading={loading} 
        />

        {/* 에러 메시지 표시 */}
        {error && (
          <ErrorMessage>
            <strong>⚠️ 오류가 발생했습니다</strong>
            {error}
            <div className="error-details">
              문제가 지속되면 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </div>
          </ErrorMessage>
        )}

        {/* 워크플로우 결과 표시 */}
        {workflowData?.success && workflowData.data && (
          <>
            {/* 상단 3개 컴포넌트: KeywordAnalytics, SearchTrendChart, MonthlyRatioChart */}
            <AnalyticsGrid>
              <KeywordAnalytics 
                analytics={workflowData.data.analysisData?.analytics || null}
                contentCounts={workflowData.data.contentCounts || null}
              />
              {workflowData.data.analysisData?.chartData && (
                <>
                  <SearchTrendChart searchTrends={workflowData.data.analysisData.chartData.searchTrends} />
                  <MonthlyRatioChart monthlyRatios={workflowData.data.analysisData.chartData.monthlyRatios} />
                </>
              )}
            </AnalyticsGrid>

            {/* 월간 발행량 컴포넌트 */}
            {workflowData.data.analysisData && (
              <AnalyticsGrid>
                <MonthlyVolume analytics={workflowData.data.analysisData.analytics} />
              </AnalyticsGrid>
            )}

            <SmartBlock 
              keywords={workflowData.data.scrapingData?.keywords?.filter(keyword => keyword.category === 'smartblock') || []} 
            />

            <RelatedKeywords 
              keywords={workflowData.data.scrapingData?.keywords?.filter(keyword => keyword.category === 'related_search') || []} 
            />

            {/* 통합 데이터 테이블 */}
            <UnifiedDataTable 
              relatedKeywords={workflowData.data.analysisData?.relatedKeywords}
            />


            {/* 네이버 블로그 검색결과 리스트 */}
            {workflowData.data.naverApiData?.original?.blogSearch && (
              <BlogSearchResults blogSearchData={workflowData.data.naverApiData.original.blogSearch} />
            )}
          </>
        )}

        {/* 안내 메시지 */}
        {!loading && !workflowData && (
          <EmptyState />
        )}

        {/* 로딩 메시지 */}
        {loading && <Loading />}
      </Card>
    </Container>
  );
}
