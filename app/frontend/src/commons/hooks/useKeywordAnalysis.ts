'use client';

import { useState } from 'react';
import type { 
  KeywordAnalysisState, 
  EnhancedIntegratedData, 
  ScrapedKeyword,
  KeywordTrendAnalysis,
  RankingComparison,
  CategoryStats,
  TimeSeriesData
} from '@/commons/types';
import { getIntegratedKeywordData } from '@/commons/apis';

/**
 * 키워드 분석 상태 관리 및 분석 로직 훅
 * API 통신은 commons/apis를 사용하고, 분석 로직과 상태 관리를 담당합니다.
 */
export const useKeywordAnalysis = () => {
  const [state, setState] = useState<KeywordAnalysisState>({
    loading: false,
    data: null,
    error: null,
  });

  // 키워드 트렌드 분석 함수
  const analyzeKeywordTrends = (keywords: ScrapedKeyword[]): KeywordTrendAnalysis => {
    // 날짜별로 키워드 그룹화
    const keywordsByDate = keywords.reduce((acc, keyword) => {
      const date = keyword.created_at.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(keyword);
      return acc;
    }, {} as { [date: string]: ScrapedKeyword[] });

    const dates = Object.keys(keywordsByDate).sort();
    if (dates.length < 2) {
      return { rising: [], falling: [], stable: [], new: [], disappeared: [] };
    }

    const latestDate = dates[dates.length - 1];
    const previousDate = dates[dates.length - 2];
    
    const latestKeywords = keywordsByDate[latestDate] || [];
    const previousKeywords = keywordsByDate[previousDate] || [];

    // 키워드 텍스트로 매핑
    const latestMap = new Map(latestKeywords.map(k => [k.text, k]));
    const previousMap = new Map(previousKeywords.map(k => [k.text, k]));

    const rising: ScrapedKeyword[] = [];
    const falling: ScrapedKeyword[] = [];
    const stable: ScrapedKeyword[] = [];
    const newKeywords: ScrapedKeyword[] = [];
    const disappeared: ScrapedKeyword[] = [];

    // 최신 키워드 분석
    latestKeywords.forEach(keyword => {
      const previousKeyword = previousMap.get(keyword.text);
      if (!previousKeyword) {
        newKeywords.push(keyword);
      } else if (keyword.rank < previousKeyword.rank) {
        rising.push(keyword);
      } else if (keyword.rank > previousKeyword.rank) {
        falling.push(keyword);
      } else {
        stable.push(keyword);
      }
    });

    // 사라진 키워드 찾기
    previousKeywords.forEach(keyword => {
      if (!latestMap.has(keyword.text)) {
        disappeared.push(keyword);
      }
    });

    return { rising, falling, stable, new: newKeywords, disappeared };
  };

  // 랭킹 변화 분석 함수
  const analyzeRankingChanges = (keywords: ScrapedKeyword[]): RankingComparison => {
    const keywordsByDate = keywords.reduce((acc, keyword) => {
      const date = keyword.created_at.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(keyword);
      return acc;
    }, {} as { [date: string]: ScrapedKeyword[] });

    const dates = Object.keys(keywordsByDate).sort();
    if (dates.length < 2) {
      return { improved: [], declined: [], maintained: [] };
    }

    const latestDate = dates[dates.length - 1];
    const previousDate = dates[dates.length - 2];
    
    const latestKeywords = keywordsByDate[latestDate] || [];
    const previousKeywords = keywordsByDate[previousDate] || [];

    const previousMap = new Map(previousKeywords.map(k => [k.text, k]));

    const improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }> = [];
    const declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }> = [];
    const maintained: Array<{ keyword: ScrapedKeyword; rank: number }> = [];

    latestKeywords.forEach(keyword => {
      const previousKeyword = previousMap.get(keyword.text);
      if (previousKeyword) {
        const change = previousKeyword.rank - keyword.rank;
        if (change > 0) {
          improved.push({ keyword, oldRank: previousKeyword.rank, newRank: keyword.rank, change });
        } else if (change < 0) {
          declined.push({ keyword, oldRank: previousKeyword.rank, newRank: keyword.rank, change: Math.abs(change) });
        } else {
          maintained.push({ keyword, rank: keyword.rank });
        }
      }
    });

    return { 
      improved: improved.sort((a, b) => b.change - a.change),
      declined: declined.sort((a, b) => b.change - a.change),
      maintained 
    };
  };

  // 카테고리별 통계 분석 함수
  const analyzeCategoryStats = (keywords: ScrapedKeyword[]): CategoryStats => {
    const categoryMap = keywords.reduce((acc, keyword) => {
      const category = keyword.keyword_type;
      if (!acc[category]) acc[category] = [];
      acc[category].push(keyword);
      return acc;
    }, {} as { [key: string]: ScrapedKeyword[] });

    const total = keywords.length;
    const stats: CategoryStats = {};

    Object.entries(categoryMap).forEach(([category, categoryKeywords]) => {
      stats[category] = {
        count: categoryKeywords.length,
        percentage: Math.round((categoryKeywords.length / total) * 100),
        topKeywords: categoryKeywords
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 5)
      };
    });

    return stats;
  };

  // 시계열 데이터 분석 함수
  const analyzeTimeSeriesData = (keywords: ScrapedKeyword[]): TimeSeriesData[] => {
    const keywordsByDate = keywords.reduce((acc, keyword) => {
      const date = keyword.created_at.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(keyword);
      return acc;
    }, {} as { [date: string]: ScrapedKeyword[] });

    return Object.entries(keywordsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dateKeywords]) => {
        const categoryDistribution = dateKeywords.reduce((acc, keyword) => {
          acc[keyword.keyword_type] = (acc[keyword.keyword_type] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        return {
          date,
          keywordCount: dateKeywords.length,
          topKeywords: dateKeywords
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 5),
          categoryDistribution
        };
      });
  };

  // 인사이트 생성 함수
  const generateInsights = (analysis: {
    trendAnalysis: KeywordTrendAnalysis;
    rankingComparison: RankingComparison;
    categoryStats: CategoryStats;
    timeSeriesData: TimeSeriesData[];
  }): string[] => {
    const insights: string[] = [];

    // 트렌드 인사이트
    if (analysis.trendAnalysis.rising.length > 0) {
      insights.push(`🔥 ${analysis.trendAnalysis.rising.length}개의 키워드가 순위 상승 중입니다.`);
    }
    if (analysis.trendAnalysis.new.length > 0) {
      insights.push(`✨ ${analysis.trendAnalysis.new.length}개의 새로운 키워드가 등장했습니다.`);
    }

    // 랭킹 인사이트
    if (analysis.rankingComparison.improved.length > 0) {
      const topImproved = analysis.rankingComparison.improved[0];
      insights.push(`📈 "${topImproved.keyword.text}"가 ${topImproved.change}단계 순위 상승했습니다.`);
    }

    // 카테고리 인사이트
    const topCategory = Object.entries(analysis.categoryStats)
      .sort(([,a], [,b]) => b.count - a.count)[0];
    if (topCategory) {
      insights.push(`📊 "${topCategory[0]}" 카테고리가 ${topCategory[1].percentage}%로 가장 많습니다.`);
    }

    // 시계열 인사이트
    if (analysis.timeSeriesData.length >= 2) {
      const latest = analysis.timeSeriesData[analysis.timeSeriesData.length - 1];
      const previous = analysis.timeSeriesData[analysis.timeSeriesData.length - 2];
      const change = latest.keywordCount - previous.keywordCount;
      if (change > 0) {
        insights.push(`📈 키워드 수가 ${change}개 증가했습니다.`);
      } else if (change < 0) {
        insights.push(`📉 키워드 수가 ${Math.abs(change)}개 감소했습니다.`);
      }
    }

    return insights;
  };

  const getIntegratedData = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const rawData = await getIntegratedKeywordData(query);
      const keywords = rawData.crawlingData?.keywords || [];
      
      let enhancedData: EnhancedIntegratedData = rawData;
      
      if (keywords.length > 0) {
        const trendAnalysis = analyzeKeywordTrends(keywords);
        const rankingComparison = analyzeRankingChanges(keywords);
        const categoryStats = analyzeCategoryStats(keywords);
        const timeSeriesData = analyzeTimeSeriesData(keywords);
        
        const analysis = {
          trendAnalysis,
          rankingComparison,
          categoryStats,
          timeSeriesData,
          insights: generateInsights({ trendAnalysis, rankingComparison, categoryStats, timeSeriesData })
        };
        
        enhancedData = {
          ...rawData,
          analysis
        };
        
        console.log('📊 [키워드 분석] 분석 완료:', {
          totalKeywords: keywords.length,
          risingKeywords: trendAnalysis.rising.length,
          newKeywords: trendAnalysis.new.length,
          categoryCount: Object.keys(categoryStats).length,
          timeSeriesPoints: timeSeriesData.length,
          insights: analysis.insights
        });
      }

      setState(prev => {
        const newState = {
          ...prev,
          loading: false,
          data: enhancedData,
        };
        console.log('✅ [통합 데이터 API] 상태 업데이트 완료:', {
          previousState: prev,
          newState,
          responseData: enhancedData
        });
        return newState;
      });
      
      return enhancedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '통합 데이터 조회 중 오류가 발생했습니다.';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  const reset = () => {
    setState({
      loading: false,
      data: null,
      error: null,
    });
  };

  return {
    ...state,
    getIntegratedData,
    reset,
  };
};