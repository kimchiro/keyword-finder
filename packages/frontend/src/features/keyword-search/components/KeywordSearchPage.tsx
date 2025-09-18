import React from 'react';
import { useKeywordSearch } from '../hooks/useKeywordSearch';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import { Container, Card, Title, ErrorMessage } from '../styles/SearchStyles';

export const KeywordSearchPage: React.FC = () => {
  const { loading, results, error, searchKeywords } = useKeywordSearch();

  const handleSearch = (query: string) => {
    searchKeywords(query, {
      headless: true,
      maxPagesPerModule: 2,
      saveToDb: true,
    });
  };

  return (
    <Container>
      <Card>
        <Title>네이버 키워드 파인더</Title>
        
        <SearchForm onSubmit={handleSearch} loading={loading} />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {results && <SearchResults results={results} />}
      </Card>
    </Container>
  );
};
