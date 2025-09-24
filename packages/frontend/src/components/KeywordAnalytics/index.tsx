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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
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

      {/* 콘텐츠 포화지수 섹션 - analytics 데이터가 있을 때만 표시 */}
      {analytics && (
        <Section>
          <SectionTitle>콘텐츠 포화지수</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatLabel>블로그 포화지수</StatLabel>
              <ProgressBar>
                <ProgressFill width={analytics.saturationIndexBlog} />
                <ProgressLabel>{formatPercentage(analytics.saturationIndexBlog)}</ProgressLabel>
              </ProgressBar>
            </StatCard>
            <StatCard>
              <StatLabel>카페 포화지수</StatLabel>
              <ProgressBar>
                <ProgressFill width={analytics.saturationIndexCafe} />
                <ProgressLabel>{formatPercentage(analytics.saturationIndexCafe)}</ProgressLabel>
              </ProgressBar>
            </StatCard>
            <StatCard>
              <StatLabel>전체 포화지수</StatLabel>
              <ProgressBar>
                <ProgressFill width={analytics.saturationIndexAll} />
                <ProgressLabel>{formatPercentage(analytics.saturationIndexAll)}</ProgressLabel>
              </ProgressBar>
            </StatCard>
          </StatsGrid>
        </Section>
      )}
    </Container>
  );
};

export type { KeywordAnalyticsProps } from './types';
