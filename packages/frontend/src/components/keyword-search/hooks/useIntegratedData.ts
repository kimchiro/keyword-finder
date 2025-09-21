'use client';

import { useState } from 'react';
import axios from 'axios';

interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

interface IntegratedData {
  query: string;
  crawlingData: {
    keywords: ScrapedKeyword[];
    total: number;
  };
  naverApiData: {
    searchResults: number;
    trendData: number;
    relatedKeywords: number;
  };
  lastUpdated: string;
}

// 키워드 트렌드 분석 결과
interface KeywordTrendAnalysis {
  rising: ScrapedKeyword[];      // 상승 키워드
  falling: ScrapedKeyword[];     // 하락 키워드
  stable: ScrapedKeyword[];      // 안정 키워드
  new: ScrapedKeyword[];         // 신규 키워드
  disappeared: ScrapedKeyword[]; // 사라진 키워드
}

// 랭킹 변화 분석
interface RankingComparison {
  improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
  maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
}

// 카테고리별 통계
interface CategoryStats {
  [key: string]: {
    count: number;
    percentage: number;
    topKeywords: ScrapedKeyword[];
  };
}

// 시계열 데이터
interface TimeSeriesData {
  date: string;
  keywordCount: number;
  topKeywords: ScrapedKeyword[];
  categoryDistribution: { [key: string]: number };
}

// 향상된 통합 데이터
interface EnhancedIntegratedData extends IntegratedData {
  analysis?: {
    trendAnalysis: KeywordTrendAnalysis;
    rankingComparison: RankingComparison;
    categoryStats: CategoryStats;
    timeSeriesData: TimeSeriesData[];
    insights: string[];
  };
}

interface IntegratedDataState {
  loading: boolean;
  data: EnhancedIntegratedData | null;
  error: string | null;
}

export const useIntegratedData = () => {
  const [state, setState] = useState<IntegratedDataState>({
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
      const response = await axios.get(`http://localhost:3001/api/naver/integrated-data/${encodeURIComponent(query)}`, {
        timeout: 30000, // 30초 타임아웃
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.data.success) {
        console.log('🔄 [통합 데이터 API] 응답 데이터:', {
          query,
          success: response.data.success,
          hasCrawlingData: !!response.data.data?.crawlingData,
          crawlingKeywordsCount: response.data.data?.crawlingData?.total || 0,
          hasNaverApiData: !!response.data.data?.naverApiData,
          lastUpdated: response.data.data?.lastUpdated,
          fullResponse: response.data
        });
        console.log('📋 [통합 데이터 API] 크롤링 키워드 상세:', response.data.data?.crawlingData?.keywords);
        console.log('🌐 [통합 데이터 API] 네이버 API 데이터:', response.data.data?.naverApiData);
        
        // 분석 수행
        const rawData = response.data.data;
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
      } else {
        console.error('❌ [통합 데이터 API] 실패:', response.data);
        throw new Error(response.data.error || '통합 데이터 조회 실패');
      }
    } catch (err) {
      let errorMessage = '통합 데이터 조회 중 오류가 발생했습니다.';
      
      if (err && typeof err === 'object') {
        if ('response' in err) {
          const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
          if (axiosError.response?.status === 404) {
            errorMessage = 'API 엔드포인트를 찾을 수 없습니다. 백엔드 서버 설정을 확인하세요.';
          } else if (axiosError.response?.status === 500) {
            errorMessage = '서버 내부 오류가 발생했습니다.';
          } else {
            errorMessage = axiosError.response?.data?.error || errorMessage;
          }
        } else if ('code' in err) {
          const networkError = err as { code: string };
          if (networkError.code === 'ECONNREFUSED') {
            errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.';
          } else if (networkError.code === 'ENOTFOUND') {
            errorMessage = '네트워크 연결을 확인하세요.';
          } else if (networkError.code === 'ETIMEDOUT') {
            errorMessage = '요청 시간이 초과되었습니다. 잠시 후 다시 시도하세요.';
          }
        } else if ('message' in err) {
          errorMessage = (err as { message: string }).message;
        }
      }

      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    console.log('🧹 [통합 데이터] 이전 데이터 초기화');
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
