import React from 'react';
import { StatsCardsGrid, StatsCard, StatsValue, StatsLabel } from '../styles/StatsCardsStyles';
import { StatsCardsProps } from '../types';

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <StatsCardsGrid>
      <StatsCard>
        <StatsValue>{stats.total?.toLocaleString() || '0'}</StatsValue>
        <StatsLabel>총 키워드 수</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.autosuggest || 0}</StatsValue>
        <StatsLabel>자동완성 키워드</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.togetherSearched || 0}</StatsValue>
        <StatsLabel>함께 많이 찾는</StatsLabel>
      </StatsCard>
      
      <StatsCard>
        <StatsValue>{stats.hotTopics || 0}</StatsValue>
        <StatsLabel>인기주제</StatsLabel>
      </StatsCard>
    </StatsCardsGrid>
  );
};
