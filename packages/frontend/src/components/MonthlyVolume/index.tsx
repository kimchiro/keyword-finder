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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <Container>
      <Title>월간 콘텐츠 발행량</Title>
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
    </Container>
  );
};

export type { MonthlyVolumeProps } from './types';
