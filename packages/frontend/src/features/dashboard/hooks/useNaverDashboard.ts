import { useState } from 'react';
import axios from 'axios';

/**
 * 네이버 대시보드 훅 - 데이터베이스 기반
 * 
 * 네이버 API에서 수집하여 DB에 저장된 데이터를 조회합니다:
 * - 네이버 검색 결과 (naver_search_results 테이블)
 * - 네이버 데이터랩 트렌드 (naver_datalab_trends 테이블)
 */

interface NaverSearchData {
  items: Array<{
    title: string;
    link: string;
    description: string;
    bloggername: string;
    bloggerlink: string;
    postdate: string;
  }>;
  total: number;
}

interface TrendData {
  period: string;
  ratio: number;
}

interface DbTrendData {
  id: number;
  period: string;
  ratio: number;
  device?: string;
  gender?: string;
  age_group?: string;
  created_at: string;
}

interface TrendResult {
  title: string;
  keywords: string[];
  data: TrendData[];
}

interface NaverDashboardState {
  loading: boolean;
  searchData: NaverSearchData | null;
  trendData: TrendResult[] | null;
  currentQuery: string | null;
  error: string | null;
}

export const useNaverDashboard = () => {
  const [state, setState] = useState<NaverDashboardState>({
    loading: false,
    searchData: null,
    trendData: null,
    currentQuery: null,
    error: null,
  });

  const searchAndAnalyze = async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      currentQuery: query,
    }));

    try {
      // 데이터베이스에서 저장된 네이버 데이터를 병렬로 조회
      const [searchResponse, trendResponse] = await Promise.allSettled([
        // DB에서 네이버 검색 결과 조회
        axios.get(`http://localhost:3001/api/naver/search-results/${encodeURIComponent(query)}?limit=10`),
        // DB에서 네이버 트렌드 데이터 조회
        axios.get(`http://localhost:3001/api/naver/trend-data/${encodeURIComponent(query)}`),
      ]);

      let searchData = null;
      let trendData = null;

      // 검색 결과 처리 (DB에서 조회)
      if (searchResponse.status === 'fulfilled' && searchResponse.value.data.success) {
        const dbResults = searchResponse.value.data.data;
        // 네이버 API 형식으로 변환
        searchData = {
          items: dbResults,
          total: dbResults.length,
        };
      }

      // 트렌드 결과 처리 (DB에서 조회)
      if (trendResponse.status === 'fulfilled' && trendResponse.value.data.success) {
        const dbTrends = trendResponse.value.data.data;
        // 네이버 API 형식으로 변환
        trendData = [{
          title: query,
          keywords: [query],
          data: Array.isArray(dbTrends) ? dbTrends.map((trend: DbTrendData) => ({
            period: trend.period,
            ratio: trend.ratio,
          })) : [],
        }];
      }

      setState(prev => ({
        ...prev,
        loading: false,
        searchData,
        trendData,
      }));

    } catch (err: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: '데이터베이스에서 데이터 조회 중 오류가 발생했습니다.',
      }));
      
      console.error('데이터베이스 조회 오류:', err);
    }
  };

  const clearData = () => {
    setState({
      loading: false,
      searchData: null,
      trendData: null,
      currentQuery: null,
      error: null,
    });
  };

  return {
    ...state,
    searchAndAnalyze,
    clearData,
  };
};
