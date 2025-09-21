'use client';

import React from 'react';
import { 
  SearchForm,
  SearchResults,
  BlogSearchResults,
  UnifiedKeywordTable
} from '@/components/keyword-search';
import { useKeywordScraping, useNaverSearch, useKeywordAnalysis } from '@/commons/hooks';
import { 
  Container, 
  Card, 
  Title, 
  ErrorMessage 
} from '@/components/keyword-search/styles';
import Loading, { EmptyState } from './loading';

export default function SearchPage() {
  const { loading: keywordLoading, results, error, scrapeKeywords } = useKeywordScraping();
  const { 
    loading: naverLoading, 
    searchResults, 
    datalabResults, 
    error: naverError, 
    searchAll
  } = useNaverSearch();
  const {
    loading: integratedLoading,
    data: integratedData,
    error: integratedError,
    getIntegratedData,
    reset: resetIntegratedData
  } = useKeywordAnalysis();



  const isLoading = keywordLoading || naverLoading || integratedLoading;

  return (
    <Container>
      <Card>
        <Title>네이버 키워드 파인더</Title>
        
        <SearchForm 
          onSubmit={(query: string) => scrapeKeywords(query, {
            headless: true,
            maxPagesPerModule: 2,
            saveToDb: true,
          })} 
          onNaverSearch={async (query: string) => {
            resetIntegratedData();
            await searchAll(query);
            try {
              await getIntegratedData(query);
            } catch {}
          }}
          loading={isLoading} 
        />

        {/* 에러 메시지 표시 */}
        {(error || naverError || integratedError) && (
          <ErrorMessage>
            {error || naverError || integratedError}
          </ErrorMessage>
        )}

        {/* 검색 결과들 */}
        {results && <SearchResults results={results} />}
        <UnifiedKeywordTable integratedData={integratedData} />
        <BlogSearchResults searchResults={searchResults} />

        {/* 안내 메시지 */}
        {!isLoading && !searchResults && !datalabResults && !integratedData && !results && (
          <EmptyState />
        )}

        {/* 로딩 메시지 */}
        {isLoading && <Loading />}
      </Card>
    </Container>
  );
}
