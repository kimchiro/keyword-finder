'use client';

import { useMemo } from 'react';
import { lineChartOptions, chartColors } from '../ChartConfig';
import { MonthlySearchRatio } from '../types/index';

interface UseTrendLineChartProps {
  data: MonthlySearchRatio[];
  keyword?: string;
}

export const useTrendLineChart = ({ data, keyword }: UseTrendLineChartProps) => {
  const chartData = useMemo(() => ({
    labels: data.map(item => {
      const date = new Date(item.month);
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short' 
      });
    }),
    datasets: [
      {
        label: keyword ? `${keyword} 검색량` : '검색량',
        data: data.map(item => item.ratio),
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        fill: true,
        tension: 0.4,
      },
    ],
  }), [data, keyword]);

  const options = useMemo(() => ({
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      title: {
        display: false,
      },
    },
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales?.y,
        title: {
          display: true,
          text: '검색 비율 (%)',
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        ...lineChartOptions.scales?.x,
        title: {
          display: true,
          text: '기간',
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  }), []);

  return {
    chartData,
    options,
  };
};
