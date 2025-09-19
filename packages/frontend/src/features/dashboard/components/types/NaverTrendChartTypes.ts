export interface NaverTrendData {
  period: string;
  ratio: number;
}

export interface NaverTrendResult {
  title: string;
  keywords: string[];
  data: NaverTrendData[];
}

export interface NaverTrendResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: NaverTrendResult[];
}

export interface NaverTrendChartProps {
  trendData: NaverTrendResponse | NaverTrendResult[] | null;
  query?: string;
}
