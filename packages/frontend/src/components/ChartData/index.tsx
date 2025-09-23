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

// Chart.js 등록 및 기본 설정
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

// Chart.js 기본 색상 설정 오버라이드
ChartJS.defaults.color = '';
ChartJS.defaults.borderColor = '#22c55e';
ChartJS.defaults.backgroundColor = '#22c55e';

// 기본 색상 팔레트 비활성화
ChartJS.defaults.plugins.colors = {
  enabled: false
};

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



  const getIssueColor = (issueType: string) => {
    switch (issueType) {
      case '급상승':
        return '#ef4444';
      case '안정':
        return '#10b981';
      case '하락':
        return '#f59e0b';
      case '신규':
        return '#06b6d4';
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

    // 강제 색상 적용을 위한 설정
    const lineColor = '#22c55e';
    const pointColor = '#22c55e';
    const fillColor = 'rgba(34, 197, 94, 0.2)';

    console.log('🎨 라인차트 색상 설정:', { lineColor, pointColor, fillColor });

    const lineChartDataset = {
      labels: sortedTrends.map(trend => trend.periodValue),
      datasets: [
        {
          type: 'line' as const,
          label: '검색량',
          data: sortedTrends.map(trend => trend.searchVolume),
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 4,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: pointColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: pointColor,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3,
          // Chart.js v4 호환성을 위한 추가 설정
          // 강제 색상 적용
          segment: {
            borderColor: lineColor,
            backgroundColor: fillColor,
          },
        },
      ],
    };
    
    console.log('📊 생성된 라인차트 데이터:', lineChartDataset);
    return lineChartDataset;
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
          backgroundColor: '#22c55eCC',
          borderColor: '#22c55e',
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
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    // 강제 색상 적용을 위한 콜백
    onHover: (event: unknown, elements: unknown, chart: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chartInstance = chart as any;
      if (chartInstance && chartInstance.data && chartInstance.data.datasets) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chartInstance.data.datasets.forEach((dataset: any) => {
          if (dataset.type === 'line' || !dataset.type) {
            dataset.borderColor = '#22c55e';
            dataset.backgroundColor = 'rgba(34, 197, 94, 0.2)';
            dataset.pointBackgroundColor = '#22c55e';
          }
        });
        chartInstance.update('none');
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 12,
          },
          color: '#22c55e',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#22c55e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#22c55e',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#22c55e',
        },
      },
      y: {
        grid: {
          color: '#22c55e',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6b7280',
          callback: function(value: string | number) {
            return new Intl.NumberFormat('ko-KR').format(Number(value));
          },
        },
      },
    },
    elements: {
      line: {
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 4,
      },
      point: {
        backgroundColor: '#22c55e',
        borderColor: '#ffffff',
        borderWidth: 3,
        radius: 8,
        hoverRadius: 10,
        hoverBackgroundColor: '#22c55e',
        hoverBorderColor: '#ffffff',
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
          color: '#22c55e',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#22c55e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
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
          color: '#22c55e',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: '#22c55e20',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6b7280',
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

      </ChartGrid>
    </Container>
  );
};

export type { ChartDataProps } from './types';
