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
          data: sortedTrends.map(trend => trend.searchVolume),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 14,
            weight: 500,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `검색량: ${new Intl.NumberFormat('ko-KR').format(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
          callback: function(value: string | number) {
            return new Intl.NumberFormat('ko-KR').format(Number(value));
          },
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
      line: {
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const,
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
