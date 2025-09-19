'use client';

import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { doughnutChartOptions, barChartOptions } from './ChartConfig';
import { useDemographicCharts } from './hooks/useDemographicCharts';
import { DemographicChartsGrid, DemographicChartContainer, DemographicChartTitle, DemographicChartWrapper } from './styles/DemographicChartsStyles';
import { DemographicChartsProps } from './types';

export const DemographicCharts: React.FC<DemographicChartsProps> = ({
  genderData,
  ageData,
  deviceData,
  weeklyData,
}) => {
  const {
    genderChartData,
    ageChartData,
    deviceChartData,
    weeklyChartData,
  } = useDemographicCharts({ genderData, ageData, deviceData, weeklyData });

  return (
    <DemographicChartsGrid>
      {/* 성별 분포 */}
      <DemographicChartContainer>
        <DemographicChartTitle>성별 검색 분포</DemographicChartTitle>
        <DemographicChartWrapper>
          <Doughnut data={genderChartData} options={doughnutChartOptions} />
        </DemographicChartWrapper>
      </DemographicChartContainer>

      {/* 연령별 분포 */}
      <DemographicChartContainer>
        <DemographicChartTitle>연령별 검색 분포</DemographicChartTitle>
        <DemographicChartWrapper>
          <Bar data={ageChartData} options={barChartOptions} />
        </DemographicChartWrapper>
      </DemographicChartContainer>

      {/* 디바이스별 분포 */}
      <DemographicChartContainer>
        <DemographicChartTitle>디바이스별 검색 분포</DemographicChartTitle>
        <DemographicChartWrapper>
          <Doughnut data={deviceChartData} options={doughnutChartOptions} />
        </DemographicChartWrapper>
      </DemographicChartContainer>

      {/* 요일별 분포 */}
      <DemographicChartContainer>
        <DemographicChartTitle>요일별 검색 분포</DemographicChartTitle>
        <DemographicChartWrapper>
          <Bar data={weeklyChartData} options={barChartOptions} />
        </DemographicChartWrapper>
      </DemographicChartContainer>
    </DemographicChartsGrid>
  );
};
