'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createLineChartOptions } from '@/commons/utils/chartConfig';
import { SearchTrendChartProps } from './types';
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
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

export const SearchTrendChart: React.FC<SearchTrendChartProps> = ({ searchTrends }) => {
  console.log('📊 SearchTrendChart - 받은 데이터:', searchTrends);

  if (!searchTrends || searchTrends.length === 0) {
    return (
      <Container>
        <Title>검색량 트렌드</Title>
        <EmptyState>검색량 트렌드 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  // 라인차트 데이터 생성
  const createLineChartData = () => {
    const sortedTrends = [...searchTrends].sort((a, b) => {
      return new Date(a.periodValue).getTime() - new Date(b.periodValue).getTime();
    });

    return {
      labels: sortedTrends.map(trend => trend.periodValue),
      datasets: [
        {
          label: '검색량',
          data: sortedTrends.map(trend => {
            // searchVolume을 안전하게 숫자로 변환
            const volume = typeof trend.searchVolume === 'string' 
              ? parseFloat(trend.searchVolume) 
              : trend.searchVolume;
            // NaN이거나 유효하지 않은 숫자면 0 반환
            return isNaN(volume) || !isFinite(volume) ? 0 : volume;
          }),
          borderColor: '#22c55e',
          backgroundColor: '#00000033',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          color: '#000000',
        },
      ],
    };
  };

  // 차트 옵션 (공통 설정 사용 + 커스텀 tooltip 색상)
  const chartOptions = {
    ...createLineChartOptions('#22c55e'),
    plugins: {
      ...createLineChartOptions('#22c55e').plugins,
      tooltip: {
        ...createLineChartOptions('#22c55e').plugins.tooltip,
        titleColor: '#000000',
        bodyColor: '#000000',
      },
    },
  };

  const chartData = createLineChartData();

  return (
    <Container>
      <Title>검색량 트렌드</Title>
      <ChartContainer>
        <Line data={chartData} options={chartOptions} />
      </ChartContainer>
    </Container>
  );
};

export type { SearchTrendChartProps } from './types';
