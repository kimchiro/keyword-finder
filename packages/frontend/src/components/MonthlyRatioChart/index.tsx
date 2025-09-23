'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createBarChartOptions } from '@/commons/utils/chartConfig';
import { MonthlyRatioChartProps } from './types';
import {
  Container,
  Title,
  ChartContainer,
  EmptyState,
} from './styles';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export const MonthlyRatioChart: React.FC<MonthlyRatioChartProps> = ({ monthlyRatios }) => {
  console.log('📊 MonthlyRatioChart - 받은 데이터:', monthlyRatios);

  if (!monthlyRatios || monthlyRatios.length === 0) {
    return (
      <Container>
        <Title>월별 검색 비율</Title>
        <EmptyState>월별 검색 비율 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  const getMonthName = (monthNum: number) => {
    return `${monthNum}월`;
  };

  // 바차트 데이터 생성
  const createBarChartData = () => {
    const sortedRatios = [...monthlyRatios].sort((a, b) => {
      return a.monthNumber - b.monthNumber;
    });

    return {
      labels: sortedRatios.map(ratio => getMonthName(ratio.monthNumber)),
      datasets: [
        {
          label: '검색 비율 (%)',
          data: sortedRatios.map(ratio => parseFloat(ratio.searchRatio.toString())),
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          borderRadius: 6,
          borderSkipped: false,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#22c55e',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  };

  // 차트 옵션 (공통 설정 사용)
  const chartOptions = createBarChartOptions('#22c55e');

  const chartData = createBarChartData();

  return (
    <Container>
      <Title>월별 검색 비율</Title>
      <ChartContainer>
        <Bar data={chartData} options={chartOptions} />
      </ChartContainer>
    </Container>
  );
};

export type { MonthlyRatioChartProps } from './types';
