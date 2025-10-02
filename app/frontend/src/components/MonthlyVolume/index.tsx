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

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('ko-KR').format(numValue);
  };

  const formatPercentage = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return `${numValue.toFixed(1)}%`;
  };

  const getCompetitionLevel = (index: number | string) => {
    const indexValue = typeof index === 'string' ? parseFloat(index) : index;
    if (indexValue >= 80) return { level: '매우 높음', color: colors.danger };
    if (indexValue >= 60) return { level: '높음', color: colors.warning };
    if (indexValue >= 40) return { level: '보통', color: colors.accent };
    if (indexValue >= 20) return { level: '낮음', color: colors.primary };
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
      </StatsGrid>
    </Container>
  );
};

export type { MonthlyVolumeProps } from './types';
