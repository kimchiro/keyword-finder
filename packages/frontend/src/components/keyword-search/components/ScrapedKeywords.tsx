import React from 'react';
import styled from '@emotion/styled';

const ScrapedContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ScrapedTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const KeywordList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
`;

const KeywordItem = styled.div`
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4a5568;
`;

interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
  keyword?: string;
  monthly_pc_qc_cnt?: number;
  monthly_mobile_qc_cnt?: number;
  monthly_ave_pc_clk_cnt?: number;
  monthly_ave_mobile_clk_cnt?: number;
  monthly_ave_pc_ctr?: number;
  monthly_ave_mobile_ctr?: number;
  comp_idx?: number;
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
  analysis?: {
    trendAnalysis: {
      rising: ScrapedKeyword[];
      falling: ScrapedKeyword[];
      stable: ScrapedKeyword[];
      new: ScrapedKeyword[];
      disappeared: ScrapedKeyword[];
    };
    rankingComparison: {
      improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
      declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
      maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
    };
    categoryStats: {
      [key: string]: {
        count: number;
        percentage: number;
        topKeywords: ScrapedKeyword[];
      };
    };
    timeSeriesData: Array<{
      date: string;
      keywordCount: number;
      topKeywords: ScrapedKeyword[];
      categoryDistribution: { [key: string]: number };
    }>;
    insights: string[];
  };
}

interface ScrapedKeywordsProps {
  integratedData?: IntegratedData | null;
}

export const ScrapedKeywords: React.FC<ScrapedKeywordsProps> = ({
  integratedData,
}) => {
  // 스크래핑된 연관 키워드 테이블
  const scrapedRelatedKeywords = integratedData?.crawlingData?.keywords?.filter(
    k => k.keyword_type === 'relatedKeywords'
  ) || [];

  if (scrapedRelatedKeywords.length === 0) {
    return null;
  }

  return (
    <ScrapedContainer>
      <ScrapedTitle>🕷️ 스크래핑된 연관 키워드</ScrapedTitle>
      <KeywordList>
        {scrapedRelatedKeywords.map((keyword, index) => (
          <KeywordItem key={index}>
            {keyword.keyword || keyword.text}
          </KeywordItem>
        ))}
      </KeywordList>
    </ScrapedContainer>
  );
};
