import React from 'react';
import { 
  Header, 
  Title, 
  RefreshButton 
} from '../styles/DashboardStyles';
import {
  SearchBarContainer,
  SearchInput,
  SearchButton
} from '../styles/SearchBarStyles';
import { DashboardHeaderProps } from '../types';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchQuery,
  onSearchQueryChange,
  onKeyPress,
  onNaverSearch,
  onRefresh,
  naverLoading,
  loading
}) => {
  return (
    <Header>
      <Title>대시보드</Title>
      <SearchBarContainer>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="네이버 검색 분석..."
          onKeyPress={onKeyPress}
          disabled={naverLoading}
        />
        <SearchButton
          onClick={onNaverSearch}
          disabled={naverLoading || !searchQuery.trim()}
          loading={naverLoading}
        >
          {naverLoading ? '분석 중...' : '네이버 분석'}
        </SearchButton>
        <RefreshButton onClick={onRefresh} disabled={loading}>
          새로고침
        </RefreshButton>
      </SearchBarContainer>
    </Header>
  );
};
