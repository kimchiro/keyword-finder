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
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.5;
  
  strong {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .error-details {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #fdd;
  }
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
    console.log(`🔍 SearchPage: 검색 시작 - "${query}"`);
    reset();
    try {
      const result = await runComplete(query);
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
