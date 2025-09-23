'use client';

import React from 'react';
import { MonthlyVolumeProps } from './types';
import { colors } from '@/commons/styles';
import {
  Container,
  Title,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatUnit,
} from './styles';

export const MonthlyVolume: React.FC<MonthlyVolumeProps> = ({ analytics }) => {
  if (!analytics) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getCompetitionLevel = (index: number) => {
    if (index >= 80) return { level: '매우 높음', color: colors.danger };
    if (index >= 60) return { level: '높음', color: colors.warning };
    if (index >= 40) return { level: '보통', color: colors.accent };
    if (index >= 20) return { level: '낮음', color: colors.primary };
    return { level: '매우 낮음', color: colors.success };
  };

  return (
    <Container>
      <Title>연간 콘텐츠 발행량 & 경쟁도</Title>
      <StatsGrid>
        <StatCard>
          <StatLabel>블로그 발행량</StatLabel>
          <StatValue>{formatNumber(analytics.monthlyContentBlog * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>카페 발행량</StatLabel>
          <StatValue>{formatNumber(analytics.monthlyContentCafe * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>총 발행량</StatLabel>
          <StatValue>{formatNumber(analytics.monthlyContentAll * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>블로그 경쟁도</StatLabel>
          <StatValue style={{ color: getCompetitionLevel(analytics.saturationIndexBlog).color }}>
            {formatPercentage(analytics.saturationIndexBlog)}
          </StatValue>
          <StatUnit style={{ color: getCompetitionLevel(analytics.saturationIndexBlog).color }}>
            {getCompetitionLevel(analytics.saturationIndexBlog).level}
          </StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>카페 경쟁도</StatLabel>
          <StatValue style={{ color: getCompetitionLevel(analytics.saturationIndexCafe).color }}>
            {formatPercentage(analytics.saturationIndexCafe)}
          </StatValue>
          <StatUnit style={{ color: getCompetitionLevel(analytics.saturationIndexCafe).color }}>
            {getCompetitionLevel(analytics.saturationIndexCafe).level}
          </StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>전체 경쟁도</StatLabel>
          <StatValue style={{ color: getCompetitionLevel(analytics.saturationIndexAll).color }}>
            {formatPercentage(analytics.saturationIndexAll)}
          </StatValue>
          <StatUnit style={{ color: getCompetitionLevel(analytics.saturationIndexAll).color }}>
            {getCompetitionLevel(analytics.saturationIndexAll).level}
          </StatUnit>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};

export type { MonthlyVolumeProps } from './types';
