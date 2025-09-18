import React from 'react';
import { DashboardData } from '../types';
import { Section, SectionTitle, ListItem, ItemText, ItemBadge, EmptyState } from '../styles/DashboardStyles';

interface RecentSearchesProps {
  recentSearches: DashboardData['recentSearches'];
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ recentSearches }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Section>
      <SectionTitle>최근 검색</SectionTitle>
      {recentSearches.length > 0 ? (
        recentSearches.map((search, index) => (
          <ListItem key={index}>
            <div>
              <ItemText>{search.query}</ItemText>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                {formatDate(search.timestamp)}
              </div>
            </div>
            <ItemBadge>{search.totalKeywords}개</ItemBadge>
          </ListItem>
        ))
      ) : (
        <EmptyState>최근 검색 기록이 없습니다</EmptyState>
      )}
    </Section>
  );
};
