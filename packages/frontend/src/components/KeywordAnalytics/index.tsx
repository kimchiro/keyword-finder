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

export const KeywordAnalytics: React.FC<KeywordAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
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
      
      {/* 월간 검색량 섹션 */}
      <Section>
        <SectionTitle>월간 검색량</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatLabel>PC 검색량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlySearchPc)}</StatValue>
            <StatUnit>회/월</StatUnit>
          </StatCard>
          <StatCard>
            <StatLabel>모바일 검색량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlySearchMobile)}</StatValue>
            <StatUnit>회/월</StatUnit>
          </StatCard>
          <StatCard>
            <StatLabel>총 검색량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlySearchTotal)}</StatValue>
            <StatUnit>회/월</StatUnit>
          </StatCard>
        </StatsGrid>
      </Section>

      {/* 월간 콘텐츠 발행량 섹션 */}
      <Section>
        <SectionTitle>월간 콘텐츠 발행량</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatLabel>블로그 발행량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlyContentBlog)}</StatValue>
            <StatUnit>개/월</StatUnit>
          </StatCard>
          <StatCard>
            <StatLabel>카페 발행량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlyContentCafe)}</StatValue>
            <StatUnit>개/월</StatUnit>
          </StatCard>
          <StatCard>
            <StatLabel>총 발행량</StatLabel>
            <StatValue>{formatNumber(analytics.monthlyContentAll)}</StatValue>
            <StatUnit>개/월</StatUnit>
          </StatCard>
        </StatsGrid>
      </Section>

      {/* 예상 검색량 섹션 */}
      <Section>
        <SectionTitle>예상 검색량</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatLabel>어제까지 예상 검색량</StatLabel>
            <StatValue>{formatNumber(analytics.estimatedSearchYesterday)}</StatValue>
            <StatUnit>회</StatUnit>
          </StatCard>
          <StatCard>
            <StatLabel>월말까지 예상 검색량</StatLabel>
            <StatValue>{formatNumber(analytics.estimatedSearchEndMonth)}</StatValue>
            <StatUnit>회</StatUnit>
          </StatCard>
        </StatsGrid>
      </Section>

      {/* 콘텐츠 포화지수 섹션 */}
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
    </Container>
  );
};

export type { KeywordAnalyticsProps } from './types';
