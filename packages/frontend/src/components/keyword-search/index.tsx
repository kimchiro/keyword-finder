import React from 'react';
import { SearchForm } from '@/commons/components';
import { useKeywordScraping, useNaverSearch, useKeywordAnalysis } from '@/commons/hooks';
import { SearchResults } from '../SearchResults';
import { BlogSearchResults } from '../BlogSearchResults';
import { UnifiedKeywordTable } from '../UnifiedKeywordTable';
import { 
  Container, 
  Card, 
  Title, 
  ErrorMessage 
} from './styles';

// 개별 컴포넌트들 export
export { SearchResults } from '../SearchResults';
export { BlogSearchResults } from '../BlogSearchResults';
export { UnifiedKeywordTable } from '../UnifiedKeywordTable';

// 훅들 re-export
export { useKeywordScraping, useNaverSearch, useKeywordAnalysis } from '@/commons/hooks';

// 타입들 export
export type * from './types';

// 공통 컴포넌트 re-export
export { SearchForm } from '@/commons/components';

interface KeywordSearchProps {
  title?: string;
  placeholder?: string;
}

// 메인 키워드 검색 컴포넌트 (모든 기능이 조립된 형태)
export const KeywordSearch: React.FC<KeywordSearchProps> = ({
  title = '네이버 키워드 파인더',
  placeholder = '검색할 키워드를 입력하세요 (예: 맛집, 카페, 여행)'
}) => {
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

  const handleSubmit = (query: string) => {
    scrapeKeywords(query, {
      headless: true,
      maxPagesPerModule: 2,
      saveToDb: true,
    });
  };

  const handleNaverSearch = async (query: string) => {
    resetIntegratedData();
    await searchAll(query);
    try {
      await getIntegratedData(query);
    } catch {
      // 에러는 각 훅에서 처리됨
    }
  };

  return (
    <Container>
      <Card>
        <Title>{title}</Title>
        
        <SearchForm 
          onSubmit={handleSubmit}
          onNaverSearch={handleNaverSearch}
          loading={isLoading}
          placeholder={placeholder}
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
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#6b7280',
            fontSize: '1.1rem'
          }}>
            키워드를 입력하고 검색해보세요! 🔍
          </div>
        )}

        {/* 로딩 메시지 */}
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#667eea',
            fontSize: '1rem'
          }}>
            검색 중입니다... ⏳
          </div>
        )}
      </Card>
    </Container>
  );
};
