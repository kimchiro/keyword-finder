'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartDataProps } from './types';
import {
  Container,
  Title,
  ChartGrid,
  ChartCard,
  ChartTitle as StyledChartTitle,
  ChartContent,
  DataList,
  DataItem,
  DataLabel,
  DataValue,
  EmptyState,
  Badge,
  ChartContainer,
} from './styles';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export const ChartData: React.FC<ChartDataProps> = ({ chartData }) => {
  console.log('🔍 ChartData 컴포넌트 - 받은 데이터:', chartData);
  
  if (!chartData) {
    console.log('❌ ChartData 컴포넌트 - 차트 데이터가 없음');
    return (
      <Container>
        <Title>차트 데이터</Title>
        <EmptyState>차트 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }


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

  // 라인차트 데이터 생성 (검색량 트렌드)
  const createLineChartData = () => {
    console.log('📊 라인차트 데이터 생성 - searchTrends:', chartData?.searchTrends);
    if (!chartData?.searchTrends || chartData.searchTrends.length === 0) {
      console.log('❌ 라인차트 - searchTrends 데이터 없음');
      return null;
    }

    const sortedTrends = [...chartData.searchTrends].sort((a, b) => {
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
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  };

  // 바차트 데이터 생성 (월별 검색비율)
  const createBarChartData = () => {
    console.log('📊 바차트 데이터 생성 - monthlyRatios:', chartData?.monthlyRatios);
    if (!chartData?.monthlyRatios || chartData.monthlyRatios.length === 0) {
      console.log('❌ 바차트 - monthlyRatios 데이터 없음');
      return null;
    }

    const sortedRatios = [...chartData.monthlyRatios].sort((a, b) => {
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
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  // 차트 옵션
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            return new Intl.NumberFormat('ko-KR').format(Number(value));
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10b981',
        borderWidth: 1,
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
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            return `${value}%`;
          },
        },
        beginAtZero: true,
      },
    },
  };

  const lineChartData = createLineChartData();
  const barChartData = createBarChartData();

  return (
    <Container>
      <Title>차트 데이터</Title>
      
      <ChartGrid>
        {/* 검색량 트렌드 - 라인차트 */}
        {lineChartData && (
          <ChartCard>
            <StyledChartTitle>검색량 트렌드</StyledChartTitle>
            <ChartContent>
              <ChartContainer>
                <Line data={lineChartData} options={lineChartOptions} />
              </ChartContainer>
            </ChartContent>
          </ChartCard>
        )}

        {/* 월별 검색 비율 - 바차트 */}
        {barChartData && (
          <ChartCard>
            <StyledChartTitle>월별 검색 비율</StyledChartTitle>
            <ChartContent>
              <ChartContainer>
                <Bar data={barChartData} options={barChartOptions} />
              </ChartContainer>
            </ChartContent>
          </ChartCard>
        )}

        {/* 요일별 검색 비율 */}
        {chartData.weekdayRatios && chartData.weekdayRatios.length > 0 && (
          <ChartCard>
            <StyledChartTitle>요일별 검색 비율</StyledChartTitle>
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
            <StyledChartTitle>성별 검색 비율</StyledChartTitle>
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
            <StyledChartTitle>이슈성 분석</StyledChartTitle>
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
            <StyledChartTitle>정보성/상업성 분석</StyledChartTitle>
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
