'use client';

import React from 'react';
import { KeywordAnalyticsProps } from './types';
import {
  Container,
  Title,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatUnit,
  Section,
  SectionTitle,
  ProgressBar,
  ProgressFill,
  ProgressLabel,
} from './styles';

export const KeywordAnalytics: React.FC<KeywordAnalyticsProps> = ({ 
  analytics, 
  contentCounts
}) => {
  // analytics나 contentCounts 중 하나라도 있으면 표시
  if (!analytics && !contentCounts) {
    return null;
  }

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('ko-KR').format(numValue);
  };

  const formatPercentage = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return `${numValue.toFixed(1)}%`;
  };

  return (
    <Container>
      <Title>키워드 분석 데이터</Title>
      
      {/* 콘텐츠 발행량 섹션 - contentCounts 데이터만 사용 */}
      {contentCounts && (
        <Section>
          <SectionTitle>콘텐츠 발행량 (총 누적)</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatLabel>블로그 발행량</StatLabel>
              <StatValue>{formatNumber(contentCounts.blogs)}</StatValue>
              <StatUnit>개 (총)</StatUnit>
            </StatCard>
            <StatCard>
              <StatLabel>카페 발행량</StatLabel>
              <StatValue>{formatNumber(contentCounts.cafes)}</StatValue>
              <StatUnit>개 (총)</StatUnit>
            </StatCard>
            <StatCard>
              <StatLabel>총 발행량</StatLabel>
              <StatValue>{formatNumber(contentCounts.total)}</StatValue>
              <StatUnit>개 (총)</StatUnit>
            </StatCard>
          </StatsGrid>
        </Section>
      )}
    </Container>
  );
};

export type { KeywordAnalyticsProps } from './types';
