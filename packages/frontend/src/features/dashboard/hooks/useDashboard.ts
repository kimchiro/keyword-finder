import { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardData, KeywordStats } from '../../../shared/types';

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
        
        // 최근 키워드 데이터에서 검색어별로 그룹화
        const recentKeywords = keywordsResponse.data.data;
        
        // 검색어별로 그룹화하여 최근 검색 목록 생성
        const queryGroups: Record<string, Array<{ query: string; created_at?: string }>> = {};
        
        recentKeywords.forEach((keyword: { query: string; created_at?: string }) => {
          if (!queryGroups[keyword.query]) {
            queryGroups[keyword.query] = [];
          }
          queryGroups[keyword.query].push(keyword);
        });
        
        // 최근 검색어 목록 생성 (최신순으로 정렬)
        const recentSearches = Object.entries(queryGroups)
          .map(([query, keywords]) => ({
            query,
            timestamp: keywords[0]?.created_at || new Date().toISOString(),
            keywordCount: keywords.length,
          }))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10); // 최근 10개만

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
