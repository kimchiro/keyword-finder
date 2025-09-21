'use client';

import React from 'react';
import { ChartDataProps } from './types';
import {
  Container,
  Title,
  ChartGrid,
  ChartCard,
  ChartTitle,
  ChartContent,
  DataList,
  DataItem,
  DataLabel,
  DataValue,
  EmptyState,
  Badge,
} from './styles';

export const ChartData: React.FC<ChartDataProps> = ({ chartData }) => {
  if (!chartData) {
    return (
      <Container>
        <Title>차트 데이터</Title>
        <EmptyState>차트 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(numValue) ? '0' : new Intl.NumberFormat('ko-KR').format(numValue);
  };

  const formatPercentage = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(numValue) ? '0.0%' : `${numValue.toFixed(1)}%`;
  };

  const getMonthName = (monthNum: number) => {
    return `${monthNum}월`;
  };

  const getWeekdayName = (weekdayNum: number) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[weekdayNum - 1] || `${weekdayNum}`;
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case '정보성':
        return '#10b981';
      case '상업성':
        return '#f59e0b';
      case '혼합':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  const getIssueColor = (issueType: string) => {
    switch (issueType) {
      case '급상승':
        return '#ef4444';
      case '안정':
        return '#10b981';
      case '하락':
        return '#f59e0b';
      case '신규':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <Container>
      <Title>차트 데이터</Title>
      
      <ChartGrid>
        {/* 검색 트렌드 */}
        {chartData.searchTrends && chartData.searchTrends.length > 0 && (
          <ChartCard>
            <ChartTitle>검색량 트렌드</ChartTitle>
            <ChartContent>
              <DataList>
                {chartData.searchTrends.slice(0, 6).map((trend, index) => (
                  <DataItem key={trend.id || index}>
                    <DataLabel>{trend.periodValue}</DataLabel>
                    <DataValue>{formatNumber(trend.searchVolume)}</DataValue>
                  </DataItem>
                ))}
              </DataList>
            </ChartContent>
          </ChartCard>
        )}

        {/* 월별 검색 비율 */}
        {chartData.monthlyRatios && chartData.monthlyRatios.length > 0 && (
          <ChartCard>
            <ChartTitle>월별 검색 비율</ChartTitle>
            <ChartContent>
              <DataList>
                {chartData.monthlyRatios.slice(0, 6).map((ratio, index) => (
                  <DataItem key={ratio.id || index}>
                    <DataLabel>{getMonthName(ratio.monthNumber)}</DataLabel>
                    <DataValue>{formatPercentage(ratio.searchRatio)}</DataValue>
                  </DataItem>
                ))}
              </DataList>
            </ChartContent>
          </ChartCard>
        )}

        {/* 요일별 검색 비율 */}
        {chartData.weekdayRatios && chartData.weekdayRatios.length > 0 && (
          <ChartCard>
            <ChartTitle>요일별 검색 비율</ChartTitle>
            <ChartContent>
              <DataList>
                {chartData.weekdayRatios.map((ratio, index) => (
                  <DataItem key={ratio.id || index}>
                    <DataLabel>{getWeekdayName(ratio.weekdayNumber)}</DataLabel>
                    <DataValue>{formatPercentage(ratio.searchRatio)}</DataValue>
                  </DataItem>
                ))}
              </DataList>
            </ChartContent>
          </ChartCard>
        )}

        {/* 성별 검색 비율 */}
        {chartData.genderRatios && (
          <ChartCard>
            <ChartTitle>성별 검색 비율</ChartTitle>
            <ChartContent>
              <DataList>
                <DataItem>
                  <DataLabel>남성</DataLabel>
                  <DataValue>{formatPercentage(chartData.genderRatios.maleRatio)}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>여성</DataLabel>
                  <DataValue>{formatPercentage(chartData.genderRatios.femaleRatio)}</DataValue>
                </DataItem>
              </DataList>
            </ChartContent>
          </ChartCard>
        )}

        {/* 이슈성 분석 */}
        {chartData.issueAnalysis && (
          <ChartCard>
            <ChartTitle>이슈성 분석</ChartTitle>
            <ChartContent>
              <DataList>
                <DataItem>
                  <DataLabel>이슈 타입</DataLabel>
                  <Badge color={getIssueColor(chartData.issueAnalysis.issueType)}>
                    {chartData.issueAnalysis.issueType}
                  </Badge>
                </DataItem>
                <DataItem>
                  <DataLabel>이슈 점수</DataLabel>
                  <DataValue>{formatPercentage(chartData.issueAnalysis.issueScore)}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>트렌드 방향</DataLabel>
                  <DataValue>{chartData.issueAnalysis.trendDirection}</DataValue>
                </DataItem>
              </DataList>
            </ChartContent>
          </ChartCard>
        )}

        {/* 의도 분석 */}
        {chartData.intentAnalysis && (
          <ChartCard>
            <ChartTitle>정보성/상업성 분석</ChartTitle>
            <ChartContent>
              <DataList>
                <DataItem>
                  <DataLabel>정보성</DataLabel>
                  <DataValue>{formatPercentage(chartData.intentAnalysis.informationalRatio)}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>상업성</DataLabel>
                  <DataValue>{formatPercentage(chartData.intentAnalysis.commercialRatio)}</DataValue>
                </DataItem>
                <DataItem>
                  <DataLabel>주요 의도</DataLabel>
                  <Badge color={getIntentColor(chartData.intentAnalysis.primaryIntent)}>
                    {chartData.intentAnalysis.primaryIntent}
                  </Badge>
                </DataItem>
              </DataList>
            </ChartContent>
          </ChartCard>
        )}
      </ChartGrid>
    </Container>
  );
};

export type { ChartDataProps } from './types';
