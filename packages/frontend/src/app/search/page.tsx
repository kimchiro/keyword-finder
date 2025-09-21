'use client';

import React from 'react';
import { 
  SearchForm,
  SearchResults,
  useKeywordSearch,
  useNaverApi,
  useIntegratedData,
  SearchTrendChart,
  ScrapedKeywords,
  // BlogSearchResults,
  KeywordTrendAnalysis
} from '@/components/keyword-search';
import { 
  Container, 
  Card, 
  Title, 
  ErrorMessage 
} from '@/components/keyword-search/styles/SearchStyles';
import Loading, { EmptyState } from './loading';

export default function SearchPage() {
  const { loading: keywordLoading, results, error, searchKeywords } = useKeywordSearch();
  const { 
    loading: naverLoading, 
    searchResults, 
    datalabResults, 
    error: naverError, 
    searchAll
  } = useNaverApi();
  const {
    loading: integratedLoading,
    data: integratedData,
    error: integratedError,
    getIntegratedData,
    reset: resetIntegratedData
  } = useIntegratedData();



  const isLoading = keywordLoading || naverLoading || integratedLoading;

  return (
    <Container>
      <Card>
        <Title>네이버 키워드 파인더</Title>
        
        <SearchForm 
          onSubmit={(query) => searchKeywords(query, {
            headless: true,
            maxPagesPerModule: 2,
            saveToDb: true,
          })} 
          onNaverSearch={async (query) => {
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
        <SearchTrendChart datalabResults={datalabResults} />
        <KeywordTrendAnalysis analysis={integratedData?.analysis} />
        <ScrapedKeywords integratedData={integratedData} />
        {/* <BlogSearchResults searchResults={searchResults} /> */}

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
