'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTrendLineChart } from './hooks/useTrendLineChart';
import { TrendChartContainer, TrendChartTitle, TrendChartWrapper } from './styles/TrendLineChartStyles';
import { TrendLineChartProps } from './types';

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ 
  data, 
  title = "검색량 트렌드", 
  keyword 
}) => {
  const { chartData, options } = useTrendLineChart({ data, keyword });

  return (
    <TrendChartContainer>
      <TrendChartTitle>{title}</TrendChartTitle>
      <TrendChartWrapper>
        <Line data={chartData} options={options} />
      </TrendChartWrapper>
    </TrendChartContainer>
  );
};
