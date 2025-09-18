import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { StatsCards } from './StatsCards';
import { RecentSearches } from './RecentSearches';
import { TopKeywords } from './TopKeywords';
import { 
  Container, 
  Header, 
  Title, 
  RefreshButton, 
  ContentGrid, 
  LoadingSpinner, 
  ErrorMessage 
} from '../styles/DashboardStyles';

export const DashboardPage: React.FC = () => {
  const { loading, data, error, refreshData } = useDashboard();

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <ErrorMessage>데이터를 불러올 수 없습니다.</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>대시보드</Title>
        <RefreshButton onClick={refreshData} disabled={loading}>
          새로고침
        </RefreshButton>
      </Header>

      <StatsCards stats={data.stats} />

      <ContentGrid>
        <RecentSearches recentSearches={data.recentSearches} />
        <TopKeywords topKeywords={data.stats.topKeywords} />
      </ContentGrid>
    </Container>
  );
};
