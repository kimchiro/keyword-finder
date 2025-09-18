import React, { useState } from 'react';
import { SearchForm as StyledSearchForm, SearchInput, SearchButton, LoadingSpinner } from '../styles/SearchStyles';

interface SearchFormProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
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
      <SearchButton type="submit" disabled={loading || !query.trim()}>
        {loading ? <LoadingSpinner /> : '키워드 수집'}
      </SearchButton>
    </StyledSearchForm>
  );
};
