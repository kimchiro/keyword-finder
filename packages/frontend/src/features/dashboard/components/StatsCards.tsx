import React from 'react';
import { KeywordStats } from '../types';
import { StatsGrid, StatCard, StatValue, StatLabel } from '../styles/DashboardStyles';

interface StatsCardsProps {
  stats: KeywordStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <StatsGrid>
      <StatCard>
        <StatValue>{stats.totalKeywords.toLocaleString()}</StatValue>
        <StatLabel>총 키워드 수</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue>{stats.keywordsByType.autosuggest}</StatValue>
        <StatLabel>자동완성 키워드</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue>{stats.keywordsByType.togetherSearched}</StatValue>
        <StatLabel>함께 많이 찾는</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue>{stats.keywordsByType.hotTopics}</StatValue>
        <StatLabel>인기주제</StatLabel>
      </StatCard>
    </StatsGrid>
  );
};
