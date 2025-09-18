import React from 'react';
import { KeywordStats } from '../types';
import { Section, SectionTitle, ListItem, ItemText, ItemBadge, EmptyState } from '../styles/DashboardStyles';

interface TopKeywordsProps {
  topKeywords: KeywordStats['topKeywords'];
}

export const TopKeywords: React.FC<TopKeywordsProps> = ({ topKeywords }) => {
  return (
    <Section>
      <SectionTitle>인기 키워드</SectionTitle>
      {topKeywords.length > 0 ? (
        topKeywords.slice(0, 10).map((keyword, index) => (
          <ListItem key={index}>
            <ItemText>{keyword.text}</ItemText>
            <ItemBadge>{keyword.count}회</ItemBadge>
          </ListItem>
        ))
      ) : (
        <EmptyState>인기 키워드 데이터가 없습니다</EmptyState>
      )}
    </Section>
  );
};
