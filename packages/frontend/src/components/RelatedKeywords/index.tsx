'use client';

import React from 'react';
import { RelatedKeywordsProps } from './types';
import {
  Container,
  Title,
  KeywordList,
  KeywordItem,
  KeywordRank,
  KeywordText,
  KeywordStats,
  StatItem,
  StatLabel,
  StatValue,
  SimilarityBadge,
  EmptyState,
} from './styles';

export const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <Container>
        <Title>연관 키워드</Title>
        <EmptyState>연관 키워드 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getSimilarityColor = (similarity: string) => {
    switch (similarity) {
      case '높음':
        return '#10b981';
      case '보통':
        return '#f59e0b';
      case '낮음':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Container>
      <Title>연관 키워드 (상위 {keywords.length}개)</Title>
      
      <KeywordList>
        {keywords.map((keyword, index) => (
          <KeywordItem key={keyword.id || index}>
            <KeywordRank>#{keyword.rankPosition}</KeywordRank>
            
            <KeywordText>{keyword.relatedKeyword}</KeywordText>
            
            <KeywordStats>
              <StatItem>
                <StatLabel>월간 검색량</StatLabel>
                <StatValue>{formatNumber(keyword.monthlySearchVolume)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>블로그 누적</StatLabel>
                <StatValue>{formatNumber(keyword.blogCumulativePosts)}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>유사도</StatLabel>
                <SimilarityBadge color={getSimilarityColor(keyword.similarityScore)}>
                  {keyword.similarityScore}
                </SimilarityBadge>
              </StatItem>
            </KeywordStats>
          </KeywordItem>
        ))}
      </KeywordList>
    </Container>
  );
};

export type { RelatedKeywordsProps } from './types';
