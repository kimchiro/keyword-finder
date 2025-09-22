'use client';

import React from 'react';
import { CompetitionIndexProps } from './types';
import {
  Container,
  Title,
  StatsGrid,
  StatCard,
  StatLabel,
  ProgressBar,
  ProgressFill,
  ProgressLabel,
} from './styles';

export const CompetitionIndex: React.FC<CompetitionIndexProps> = ({ analytics }) => {
  if (!analytics) {
    return null;
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getCompetitionLevel = (index: number) => {
    if (index >= 80) return { level: '매우 높음', color: '#ef4444' };
    if (index >= 60) return { level: '높음', color: '#f59e0b' };
    if (index >= 40) return { level: '보통', color: '#eab308' };
    if (index >= 20) return { level: '낮음', color: '#22c55e' };
    return { level: '매우 낮음', color: '#10b981' };
  };

  return (
    <Container>
      <Title>키워드 경쟁도</Title>
      <StatsGrid>
        <StatCard>
          <StatLabel>블로그 경쟁도</StatLabel>
          <ProgressBar>
            <ProgressFill 
              width={analytics.saturationIndexBlog} 
              color={getCompetitionLevel(analytics.saturationIndexBlog).color}
            />
            <ProgressLabel>{formatPercentage(analytics.saturationIndexBlog)}</ProgressLabel>
          </ProgressBar>
          <div style={{ 
            fontSize: '12px', 
            color: getCompetitionLevel(analytics.saturationIndexBlog).color,
            fontWeight: '600',
            marginTop: '8px'
          }}>
            {getCompetitionLevel(analytics.saturationIndexBlog).level}
          </div>
        </StatCard>
        <StatCard>
          <StatLabel>카페 경쟁도</StatLabel>
          <ProgressBar>
            <ProgressFill 
              width={analytics.saturationIndexCafe} 
              color={getCompetitionLevel(analytics.saturationIndexCafe).color}
            />
            <ProgressLabel>{formatPercentage(analytics.saturationIndexCafe)}</ProgressLabel>
          </ProgressBar>
          <div style={{ 
            fontSize: '12px', 
            color: getCompetitionLevel(analytics.saturationIndexCafe).color,
            fontWeight: '600',
            marginTop: '8px'
          }}>
            {getCompetitionLevel(analytics.saturationIndexCafe).level}
          </div>
        </StatCard>
        <StatCard>
          <StatLabel>전체 경쟁도</StatLabel>
          <ProgressBar>
            <ProgressFill 
              width={analytics.saturationIndexAll} 
              color={getCompetitionLevel(analytics.saturationIndexAll).color}
            />
            <ProgressLabel>{formatPercentage(analytics.saturationIndexAll)}</ProgressLabel>
          </ProgressBar>
          <div style={{ 
            fontSize: '12px', 
            color: getCompetitionLevel(analytics.saturationIndexAll).color,
            fontWeight: '600',
            marginTop: '8px'
          }}>
            {getCompetitionLevel(analytics.saturationIndexAll).level}
          </div>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};

export type { CompetitionIndexProps } from './types';
