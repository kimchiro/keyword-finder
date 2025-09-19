import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// 공통 차트 옵션
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: 'Geist, sans-serif',
          size: 12,
        },
        color: '#374151',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#667eea',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 11,
        },
      },
    },
  },
};

// 색상 팔레트
export const chartColors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  info: '#4299e1',
  gradient: [
    '#667eea',
    '#764ba2',
    '#48bb78',
    '#ed8936',
    '#f56565',
    '#4299e1',
    '#9f7aea',
    '#38b2ac',
  ],
};

// 도넛 차트 옵션
export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        font: {
          family: 'Geist, sans-serif',
          size: 12,
        },
        color: '#374151',
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#667eea',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function(context: { label: string; parsed: number }) {
          const label = context.label || '';
          const value = context.parsed || 0;
          return `${label}: ${value.toFixed(1)}%`;
        },
      },
    },
  },
  cutout: '60%',
};

// 라인 차트 옵션
export const lineChartOptions = {
  ...commonChartOptions,
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 3,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
};

// 바 차트 옵션
export const barChartOptions = {
  ...commonChartOptions,
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
    },
  },
};
