import React, { useState } from 'react';
import {
  SearchFormContainer,
  SearchInput,
  SearchButton,
  LoadingSpinner,
  ButtonGroup
} from './styles';

export interface SearchFormProps {
  onSubmit?: (query: string) => void;
  onNaverSearch?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  submitButtonText?: string;
  naverButtonText?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  onNaverSearch,
  loading = false,
  placeholder = '검색할 키워드를 입력하세요',
  submitButtonText = '키워드 수집 (스크래핑)',
  naverButtonText = '🔍 검색하기'
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !onSubmit) return;
    onSubmit(query);
  };

  const handleNaverSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (query.trim() && onNaverSearch) {
      onNaverSearch(query.trim());
    }
  };

  return (
    <SearchFormContainer onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <ButtonGroup>
        {onSubmit && (
          <SearchButton type="submit" disabled={loading || !query.trim()}>
            {loading ? <LoadingSpinner /> : submitButtonText}
          </SearchButton>
        )}
        {onNaverSearch && (
          <SearchButton 
            type="button" 
            onClick={handleNaverSearch}
            disabled={loading || !query.trim()}
            variant="primary"
          >
            {loading ? <LoadingSpinner /> : naverButtonText}
          </SearchButton>
        )}
      </ButtonGroup>
    </SearchFormContainer>
  );
};
