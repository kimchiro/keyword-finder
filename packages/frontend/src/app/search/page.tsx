'use client';

import React from 'react';
import { SearchForm } from '@/commons/components';
import { BlogSearchResults } from '@/components/BlogSearchResults';
import { KeywordAnalytics } from '@/components/KeywordAnalytics';
import { RelatedKeywords } from '@/components/RelatedKeywords';
import { ChartData } from '@/components/ChartData';
import { SmartBlock } from '@/components/SmartBlock';
import { useWorkflow } from '@/commons/hooks';
import styled from '@emotion/styled';
import Loading, { EmptyState } from './loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
`;

export default function SearchPage() {
  const {
    loading,
    data: workflowData,
    error,
    runComplete,
    reset
  } = useWorkflow();

  const handleSearch = async (query: string) => {
    reset();
    try {
      await runComplete(query);
    } catch (error) {
      console.error('워크플로우 실행 실패:', error);
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
            {error}
          </ErrorMessage>
        )}

        {/* 워크플로우 결과 표시 */}
        {workflowData && (
          <>
            {/* 키워드 분석 데이터 */}
            {workflowData.analysisData && (
              <>
                <KeywordAnalytics analytics={workflowData.analysisData.analytics} />
                <RelatedKeywords keywords={workflowData.analysisData.relatedKeywords} />
                <ChartData chartData={workflowData.analysisData.chartData} />
              </>
            )}

            {/* 네이버 블로그 검색 결과 */}
            {workflowData.naverApiData && (
              <BlogSearchResults searchResults={workflowData.naverApiData.blogSearch} />
            )}

            {/* 스마트블록 키워드 */}
            {workflowData.scrapingData && (
              <SmartBlock scrapingData={workflowData.scrapingData} />
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
