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
  TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
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
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
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
        borderColor: '#10b981',
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
          label: function(context: TooltipItem<'bar'>) {
            return `${context.dataset.label || '검색 비율'}: ${context.parsed.y.toFixed(1)}%`;
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
            return `${value}%`;
          },
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
  };

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
