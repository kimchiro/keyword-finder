'use client';

import { useMemo } from 'react';
import { chartColors } from '../ChartConfig';
import { KeywordAttributes } from '../types/index';


interface UseKeywordAttributesChartProps {
  data: KeywordAttributes;
}

export const useKeywordAttributesChart = ({ data }: UseKeywordAttributesChartProps) => {
  const chartData = useMemo(() => ({
    labels: ['이슈성', '정보성', '상업성'],
    datasets: [
      {
        label: data.keyword,
        data: [data.issue, data.information, data.commercial],
        backgroundColor: `${chartColors.primary}30`,
        borderColor: chartColors.primary,
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: { r: number } }) {
            const label = context.label || '';
            const value = context.parsed.r || 0;
            return `${label}: ${value}점`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: '#e5e7eb',
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold' as const,
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
