import React from 'react';
import { StatsCardsGrid, StatsCard, StatsValue, StatsLabel } from './styles/StatsCardsStyles';
import { StatsCardsProps } from './types/StatsCardsTypes';

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <StatsCardsGrid>
      <StatsCard>
        <StatsValue>{stats.totalKeywords.toLocaleString()}</StatsValue>
        <StatsLabel>총 키워드 수</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.keywordsByType.autosuggest}</StatsValue>
        <StatsLabel>자동완성 키워드</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.keywordsByType.togetherSearched}</StatsValue>
        <StatsLabel>함께 많이 찾는</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.keywordsByType.hotTopics}</StatsValue>
        <StatsLabel>인기주제</StatsLabel>
      </StatsCard>
    </StatsCardsGrid>
  );
};
