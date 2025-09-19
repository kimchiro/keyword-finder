'use client';

import { useMemo } from 'react';
import { chartColors } from '../ChartConfig';
import { 
  GenderSearchRatio, 
  AgeSearchRatio, 
  DeviceSearchRatio, 
  WeeklySearchRatio 
} from '../types/index';

interface UseDemographicChartsProps {
  genderData: GenderSearchRatio[];
  ageData: AgeSearchRatio[];
  deviceData: DeviceSearchRatio[];
  weeklyData: WeeklySearchRatio[];
}

export const useDemographicCharts = ({
  genderData,
  ageData,
  deviceData,
  weeklyData,
}: UseDemographicChartsProps) => {
  // 성별 차트 데이터
  const genderChartData = useMemo(() => ({
    labels: genderData.map(item => item.gender),
    datasets: [
      {
        data: genderData.map(item => item.ratio),
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
        ],
        borderWidth: 0,
      },
    ],
  }), [genderData]);

  // 연령별 차트 데이터
  const ageChartData = useMemo(() => ({
    labels: ageData.map(item => item.age),
    datasets: [
      {
        label: '검색 비율 (%)',
        data: ageData.map(item => item.ratio),
        backgroundColor: chartColors.gradient.slice(0, ageData.length),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }), [ageData]);

  // 디바이스별 차트 데이터
  const deviceChartData = useMemo(() => ({
    labels: deviceData.map(item => item.device),
    datasets: [
      {
        data: deviceData.map(item => item.ratio),
        backgroundColor: [
          chartColors.success,
          chartColors.warning,
        ],
        borderWidth: 0,
      },
    ],
  }), [deviceData]);

  // 요일별 차트 데이터
  const weeklyChartData = useMemo(() => ({
    labels: weeklyData.map(item => item.dayOfWeek),
    datasets: [
      {
        label: '검색 비율 (%)',
        data: weeklyData.map(item => item.ratio),
        backgroundColor: chartColors.info,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }), [weeklyData]);

  return {
    genderChartData,
    ageChartData,
    deviceChartData,
    weeklyChartData,
  };
};
