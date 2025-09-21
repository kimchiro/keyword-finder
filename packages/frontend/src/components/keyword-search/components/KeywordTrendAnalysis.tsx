import React from 'react';
import styled from '@emotion/styled';

const AnalysisContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const AnalysisTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const InsightsSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  padding: 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
`;

const TrendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TrendCard = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const TrendCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const KeywordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const KeywordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  font-size: 0.85rem;
`;

const KeywordText = styled.span`
  color: #4a5568;
  font-weight: 500;
`;

const RankBadge = styled.span<{ trend: 'up' | 'down' | 'new' | 'stable' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ trend }) => {
    switch (trend) {
      case 'up':
        return 'background: #c6f6d5; color: #22543d;';
      case 'down':
        return 'background: #fed7d7; color: #742a2a;';
      case 'new':
        return 'background: #bee3f8; color: #2a4365;';
      case 'stable':
        return 'background: #e2e8f0; color: #4a5568;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

const CategoryStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const CategoryName = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const CategoryCount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const CategoryPercentage = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

interface KeywordTrendAnalysisProps {
  analysis?: {
    trendAnalysis: {
      rising: Array<{ text: string; rank: number }>;
      falling: Array<{ text: string; rank: number }>;
      stable: Array<{ text: string; rank: number }>;
      new: Array<{ text: string; rank: number }>;
      disappeared: Array<{ text: string; rank: number }>;
    };
    rankingComparison: {
      improved: Array<{ keyword: { text: string }; oldRank: number; newRank: number; change: number }>;
      declined: Array<{ keyword: { text: string }; oldRank: number; newRank: number; change: number }>;
    };
    categoryStats: {
      [key: string]: {
        count: number;
        percentage: number;
        topKeywords: Array<{ text: string }>;
      };
    };
    insights: string[];
  };
}

export const KeywordTrendAnalysis: React.FC<KeywordTrendAnalysisProps> = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  const { trendAnalysis, rankingComparison, categoryStats, insights } = analysis;

  return (
    <AnalysisContainer>
      <AnalysisTitle>📊 키워드 트렌드 분석</AnalysisTitle>

      {/* 인사이트 섹션 */}
      {insights.length > 0 && (
        <InsightsSection>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>💡 주요 인사이트</h4>
          <InsightsList>
            {insights.map((insight, index) => (
              <InsightItem key={index}>{insight}</InsightItem>
            ))}
          </InsightsList>
        </InsightsSection>
      )}

      {/* 트렌드 카드들 */}
      <TrendGrid>
        {/* 상승 키워드 */}
        {trendAnalysis.rising.length > 0 && (
          <TrendCard>
            <TrendCardTitle>
              🔥 상승 키워드 ({trendAnalysis.rising.length}개)
            </TrendCardTitle>
            <KeywordList>
              {trendAnalysis.rising.slice(0, 5).map((keyword, index) => (
                <KeywordItem key={index}>
                  <KeywordText>{keyword.text}</KeywordText>
                  <RankBadge trend="up">#{keyword.rank}</RankBadge>
                </KeywordItem>
              ))}
            </KeywordList>
          </TrendCard>
        )}

        {/* 신규 키워드 */}
        {trendAnalysis.new.length > 0 && (
          <TrendCard>
            <TrendCardTitle>
              ✨ 신규 키워드 ({trendAnalysis.new.length}개)
            </TrendCardTitle>
            <KeywordList>
              {trendAnalysis.new.slice(0, 5).map((keyword, index) => (
                <KeywordItem key={index}>
                  <KeywordText>{keyword.text}</KeywordText>
                  <RankBadge trend="new">NEW</RankBadge>
                </KeywordItem>
              ))}
            </KeywordList>
          </TrendCard>
        )}

        {/* 하락 키워드 */}
        {trendAnalysis.falling.length > 0 && (
          <TrendCard>
            <TrendCardTitle>
              📉 하락 키워드 ({trendAnalysis.falling.length}개)
            </TrendCardTitle>
            <KeywordList>
              {trendAnalysis.falling.slice(0, 5).map((keyword, index) => (
                <KeywordItem key={index}>
                  <KeywordText>{keyword.text}</KeywordText>
                  <RankBadge trend="down">#{keyword.rank}</RankBadge>
                </KeywordItem>
              ))}
            </KeywordList>
          </TrendCard>
        )}

        {/* 순위 변화 */}
        {rankingComparison.improved.length > 0 && (
          <TrendCard>
            <TrendCardTitle>
              📈 순위 상승 ({rankingComparison.improved.length}개)
            </TrendCardTitle>
            <KeywordList>
              {rankingComparison.improved.slice(0, 5).map((item, index) => (
                <KeywordItem key={index}>
                  <KeywordText>{item.keyword.text}</KeywordText>
                  <RankBadge trend="up">+{item.change}</RankBadge>
                </KeywordItem>
              ))}
            </KeywordList>
          </TrendCard>
        )}
      </TrendGrid>

      {/* 카테고리 통계 */}
      {Object.keys(categoryStats).length > 0 && (
        <>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>📋 카테고리별 통계</h4>
          <CategoryStatsGrid>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <CategoryCard key={category}>
                <CategoryName>{category}</CategoryName>
                <CategoryCount>{stats.count}</CategoryCount>
                <CategoryPercentage>{stats.percentage}%</CategoryPercentage>
              </CategoryCard>
            ))}
          </CategoryStatsGrid>
        </>
      )}
    </AnalysisContainer>
  );
};
