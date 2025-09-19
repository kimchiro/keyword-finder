import React, { useState } from 'react';
import { SearchFormProps } from '../types';
import { SearchForm as StyledSearchForm, SearchInput, SearchButton, LoadingSpinner, ButtonGroup } from '../styles/SearchStyles';

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, onNaverSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
  };

  const handleNaverSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (query.trim() && onNaverSearch) {
      onNaverSearch(query.trim());
    }
  };

  return (
    <StyledSearchForm onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder="검색할 키워드를 입력하세요 (예: 맛집, 카페, 여행)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <ButtonGroup>
        <SearchButton type="submit" disabled={loading || !query.trim()}>
          {loading ? <LoadingSpinner /> : '키워드 수집 (스크래핑)'}
        </SearchButton>
        {onNaverSearch && (
          <SearchButton 
            type="button" 
            onClick={handleNaverSearch}
            disabled={loading || !query.trim()}
            variant="primary"
          >
            {loading ? <LoadingSpinner /> : '🔍 검색하기'}
          </SearchButton>
        )}
      </ButtonGroup>
    </StyledSearchForm>
  );
};
