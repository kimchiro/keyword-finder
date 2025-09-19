import { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardData, KeywordStats } from '../types';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 통계 데이터 가져오기
      const statsResponse = await axios.get('http://localhost:3001/api/stats');
      
      // 최근 키워드 데이터 가져오기 (최근 10개)
      const keywordsResponse = await axios.get('http://localhost:3001/api/keywords?limit=10');

      if (statsResponse.data.success && keywordsResponse.data.success) {
        const stats: KeywordStats = statsResponse.data.data;
        
        // 최근 검색어별로 그룹화 (모든 검색 기록 표시)
        const recentKeywords = keywordsResponse.data.data;
        const recentSearches = stats.recentQueries.map(query => {
          const queryKeywords = recentKeywords.filter((k: { query: string; created_at?: string }) => k.query === query);
          return {
            query,
            timestamp: queryKeywords[0]?.created_at || new Date().toISOString(),
            totalKeywords: queryKeywords.length,
          };
        });

        setData({
          stats,
          recentSearches,
        });
      } else {
        throw new Error('데이터를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    loading,
    data,
    error,
    refreshData,
  };
};
