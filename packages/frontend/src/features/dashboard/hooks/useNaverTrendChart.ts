'use client';

import { useCallback, useMemo } from 'react';

interface TrendData {
  period: string;
  ratio: number;
}

interface TrendResult {
  title: string;
  keywords: string[];
  data: TrendData[];
}

interface NaverTrendData {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: TrendResult[];
}

export const useNaverTrendChart = (trendData: NaverTrendData | TrendResult[] | null) => {
  const formatPeriod = useCallback((period: string) => {
    const date = new Date(period);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
    });
  }, []);

  const calculateAverage = useCallback((data: TrendData[]) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.ratio, 0);
    return Math.round(sum / data.length);
  }, []);

  const findPeakPeriod = useCallback((data: TrendData[]) => {
    if (!data || data.length === 0) return null;
    return data.reduce((max, item) => item.ratio > max.ratio ? item : max);
  }, []);

  const trendStats = useMemo(() => {
    if (!trendData) return null;

    // Array 타입인 경우 (TrendResult[])
    if (Array.isArray(trendData)) {
      if (trendData.length === 0) return null;
      const result = trendData[0];
      const average = calculateAverage(result.data);
      const peak = findPeakPeriod(result.data);

      return {
        average,
        peak,
        totalPeriods: result.data.length,
        dateRange: '분석 기간',
      };
    }

    // NaverTrendData 타입인 경우
    if (!trendData.results || trendData.results.length === 0) {
      return null;
    }

    const result = trendData.results[0];
    const average = calculateAverage(result.data);
    const peak = findPeakPeriod(result.data);

    return {
      average,
      peak,
      totalPeriods: result.data.length,
      dateRange: `${trendData.startDate} ~ ${trendData.endDate}`,
    };
  }, [trendData, calculateAverage, findPeakPeriod]);

  return {
    formatPeriod,
    calculateAverage,
    findPeakPeriod,
    trendStats,
  };
};
