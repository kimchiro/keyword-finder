'use client';

import React from 'react';
import { MonthlyVolumeProps } from './types';
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

  const toNumber = (value: number | string): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  return (
    <Container>
      <Title>연간 콘텐츠 발행량 & 경쟁도</Title>
      <StatsGrid>
        <StatCard>
          <StatLabel>블로그 발행량</StatLabel>
          <StatValue>{formatNumber(toNumber(analytics.monthlyContentBlog) * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>카페 발행량</StatLabel>
          <StatValue>{formatNumber(toNumber(analytics.monthlyContentCafe) * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
        <StatCard>
          <StatLabel>총 발행량</StatLabel>
          <StatValue>{formatNumber(toNumber(analytics.monthlyContentAll) * 12)}</StatValue>
          <StatUnit>개/년</StatUnit>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};

export type { MonthlyVolumeProps } from './types';
