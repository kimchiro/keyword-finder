import { colors } from '@/commons/styles';

// 공통 차트 폰트 설정
export const chartFontConfig = {
  family: 'system-ui, -apple-system, sans-serif',
  size: 12,
  weight: 500,
};

// 공통 차트 옵션
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          ...chartFontConfig,
          size: 14,
        },
        padding: 20,
        color: colors.textPrimary,
        usePointStyle: true,
      },
    },
  },
  scales: {
    x: {
      grid: {
        lineWidth: 1,
      },
      ticks: {
        font: chartFontConfig,
        maxRotation: 45,
      },
    },
    y: {
      grid: {
        lineWidth: 1,
      },
      ticks: {
        font: chartFontConfig,
      },
      beginAtZero: true,
    },
  },
};

// 툴팁 공통 설정
export const createTooltipConfig = (backgroundColor: string, borderColor: string) => ({
  backgroundColor: `${backgroundColor}CC`,
  titleColor: colors.textInverse,
  bodyColor: colors.textInverse,
  borderColor,
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
});

// 라인 차트 전용 설정
export const createLineChartOptions = (color: string) => ({
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      ...createTooltipConfig(color, color),
      callbacks: {
        label: function(context: { parsed: { y: number } }) {
          return `검색량: ${new Intl.NumberFormat('ko-KR').format(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    ...baseChartOptions.scales,
    x: {
      ...baseChartOptions.scales.x,
      grid: {
        ...baseChartOptions.scales.x.grid,
        color: `${color}33`,
      },
      ticks: {
        ...baseChartOptions.scales.x.ticks,
        color,
      },
    },
    y: {
      ...baseChartOptions.scales.y,
      grid: {
        ...baseChartOptions.scales.y.grid,
        color: `${color}33`,
      },
      ticks: {
        ...baseChartOptions.scales.y.ticks,
        color,
        callback: function(value: string | number) {
          return new Intl.NumberFormat('ko-KR').format(Number(value));
        },
      },
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
});

// 바 차트 전용 설정
export const createBarChartOptions = (color: string) => ({
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      ...createTooltipConfig(color, color),
      callbacks: {
        label: function(context: { dataset: { label?: string }; parsed: { y: number | string } }) {
          const yValue = typeof context.parsed.y === 'string' ? parseFloat(context.parsed.y) : context.parsed.y;
          // NaN 체크 추가
          if (isNaN(yValue) || !isFinite(yValue)) {
            return `${context.dataset.label || '검색 비율'}: 0.0%`;
          }
          return `${context.dataset.label || '검색 비율'}: ${yValue.toFixed(1)}%`;
        },
      },
    },
  },
  scales: {
    ...baseChartOptions.scales,
    x: {
      ...baseChartOptions.scales.x,
      grid: {
        ...baseChartOptions.scales.x.grid,
        color: `${color}33`,
      },
      ticks: {
        ...baseChartOptions.scales.x.ticks,
        color,
      },
    },
    y: {
      ...baseChartOptions.scales.y,
      grid: {
        ...baseChartOptions.scales.y.grid,
        color: `${color}33`,
      },
      ticks: {
        ...baseChartOptions.scales.y.ticks,
        color,
        callback: function(value: string | number) {
          return `${value}%`;
        },
      },
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
});
