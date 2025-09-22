'use client';

import React from 'react';
import { RelatedKeywordsProps } from './types';
import {
  Container,
  Title,
  ScrollContainer,
  KeywordList,
  KeywordItem,
  KeywordText,
  KeywordStats,
  StatItem,
  StatLabel,
  StatValue,
  SimilarityBadge,
  EmptyState,
  RankBadge,
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

  const getSimilarityColor = (similarity: 'low' | 'medium' | 'high') => {
    switch (similarity) {
      case 'high':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSimilarityText = (similarity: 'low' | 'medium' | 'high') => {
    switch (similarity) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '알 수 없음';
    }
  };

  const getCompetitionText = (competition: 'low' | 'medium' | 'high') => {
    switch (competition) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Container>
      <Title>연관 키워드 (상위 {keywords.length}개)</Title>
      <ScrollContainer>
        <KeywordList>
          {keywords.map((keyword, index) => (
            <KeywordItem key={`${keyword.keyword}-${index}`}>
              <RankBadge rank={keyword.rank}>#{keyword.rank}</RankBadge>
              
              <KeywordText>{keyword.keyword}</KeywordText>
              
              <KeywordStats>
                <StatItem>
                  <StatLabel>카테고리</StatLabel>
                  <StatValue>{keyword.category === 'related_search' ? '연관검색어' : keyword.category}</StatValue>
                </StatItem>
                
                <StatItem>
                  <StatLabel>경쟁도</StatLabel>
                  <StatValue>{getCompetitionText(keyword.competition)}</StatValue>
                </StatItem>
                
                <StatItem>
                  <StatLabel>유사도</StatLabel>
                  <SimilarityBadge color={getSimilarityColor(keyword.similarity)}>
                    {getSimilarityText(keyword.similarity)}
                  </SimilarityBadge>
                </StatItem>
              </KeywordStats>
            </KeywordItem>
          ))}
        </KeywordList>
      </ScrollContainer>
    </Container>
  );
};

export type { RelatedKeywordsProps } from './types';
