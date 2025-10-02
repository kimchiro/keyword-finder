'use client';

import React from 'react';
import { SearchForm } from '@/commons/components';
import { BlogSearchResults } from '@/components/BlogSearchResults';
import { KeywordAnalytics } from '@/components/KeywordAnalytics';
import { SearchTrendChart } from '@/components/SearchTrendChart';
import { IntegratedKeywordTable } from '@/components/IntegratedKeywordTable';
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
  background: ${colors.bgPrimary};
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
            <AnalyticsGrid>
              <KeywordAnalytics 
                analytics={workflowData.data.analysisData?.analytics || null}
                contentCounts={(() => {
                  if (workflowData.data.contentCountsData?.counts) {
                    return workflowData.data.contentCountsData.counts;
                  }
                  return {
                    blogs: workflowData.data.naverApiData?.blogSearch?.total || 0,
                    cafes: 0, // 카페 데이터는 현재 응답에 없음
                    total: workflowData.data.naverApiData?.blogSearch?.total || 0
                  };
                })()}
              />
              {(() => {
                // analysisData.chartData.searchTrends 우선 사용, 없으면 naverApiData.datalab 변환
                const chartSearchTrends = workflowData.data.analysisData?.chartData?.searchTrends;
                const datalabData = workflowData.data.naverApiData?.datalab;
                
                console.log('📊 SearchTrendChart 데이터 확인:', {
                  hasChartSearchTrends: !!chartSearchTrends,
                  chartSearchTrendsLength: chartSearchTrends?.length || 0,
                  hasDatalabData: !!datalabData,
                  datalabResultsLength: datalabData?.results?.length || 0,
                  datalabFirstResultDataLength: datalabData?.results?.[0]?.data?.length || 0,
                  datalabTimeUnit: datalabData?.timeUnit,
                  datalabTitle: datalabData?.results?.[0]?.title,
                });
                
                let searchTrends = chartSearchTrends;
                let dataSource = 'chartData';
                
                // chartSearchTrends가 비어있고 datalab 데이터가 있으면 변환
                if ((!chartSearchTrends || chartSearchTrends.length === 0) && datalabData?.results?.[0]?.data) {
                  console.log('🔄 chartSearchTrends가 비어있어서 datalab 데이터를 변환합니다');
                  searchTrends = datalabData.results[0].data.map((item: { period: string; ratio: number }) => ({
                    keyword: datalabData.results[0].title,
                    periodType: (datalabData.timeUnit === 'month' ? 'monthly' : 
                                datalabData.timeUnit === 'week' ? 'weekly' : 'daily') as 'daily' | 'weekly' | 'monthly',
                    periodValue: item.period,
                    searchVolume: item.ratio,
                  }));
                  dataSource = 'datalabFallback';
                  console.log('✅ datalab 데이터 변환 완료:', searchTrends?.length, '개');
                }
                
                if (searchTrends && searchTrends.length > 0) {
                  console.log('✅ SearchTrendChart 표시:', { 
                    count: searchTrends.length, 
                    dataSource,
                    sampleData: searchTrends.slice(0, 2)
                  });
                  return <SearchTrendChart searchTrends={searchTrends} />;
                } else {
                  console.warn('⚠️ SearchTrendChart 숨김: 데이터 없음', {
                    chartSearchTrendsAvailable: !!chartSearchTrends && chartSearchTrends.length > 0,
                    datalabDataAvailable: !!datalabData?.results?.[0]?.data,
                  });
                  return null;
                }
              })()}
            </AnalyticsGrid>

            {/* 통합 키워드 테이블 */}
            {(() => {
              // 모든 스크래핑 데이터를 사용 (카테고리 구분 없이 모든 키워드 표시)
              const allScrapedKeywords = workflowData.data.scrapingData?.keywords || [];
              
              // analysisData의 relatedKeywords가 있으면 사용, 없으면 빈 배열
              const relatedData = workflowData.data.analysisData?.relatedKeywords || [];

              console.log('🚀 SearchPage - 통합키워드테이블 데이터 연결 상태:', {
                // 원본 스크래핑 데이터
                rawScrapingData: {
                  totalKeywords: allScrapedKeywords.length,
                  keywordsByCategory: allScrapedKeywords.reduce((acc, keyword) => {
                    acc[keyword.category] = (acc[keyword.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>),
                  sampleKeywords: allScrapedKeywords.slice(0, 5).map(k => ({ 
                    keyword: k.keyword, 
                    category: k.category,
                    rank: k.rank,
                    competition: k.competition,
                    similarity: k.similarity
                  }))
                },
                // 분석 데이터 활용
                analysisData: {
                  hasAnalytics: !!workflowData.data.analysisData?.analytics,
                  hasRelatedKeywords: !!workflowData.data.analysisData?.relatedKeywords,
                  analysisRelatedCount: workflowData.data.analysisData?.relatedKeywords?.length || 0,
                  hasChartData: !!workflowData.data.analysisData?.chartData
                },
                // 최종 테이블 전달 데이터
                tableData: {
                  allScrapedKeywords: allScrapedKeywords.length,
                  relatedKeywords: relatedData.length,
                  totalForTable: allScrapedKeywords.length + relatedData.length
                }
              });

              console.log('📋 IntegratedKeywordTable 최종 전달 데이터:', {
                smartBlockKeywords: allScrapedKeywords.length,
                relatedKeywords: relatedData.length,
                usingAllScrapedData: true
              });

              return (
                <IntegratedKeywordTable 
                  smartBlockKeywords={allScrapedKeywords}
                  relatedKeywords={relatedData}
                  showFilters={true}
                />
              );
            })()}

            {/* 네이버 블로그 검색결과 리스트 */}
            {workflowData.data.naverApiData?.blogSearch && (
              <BlogSearchResults 
                blogSearchData={workflowData.data.naverApiData.blogSearch} 
              />
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