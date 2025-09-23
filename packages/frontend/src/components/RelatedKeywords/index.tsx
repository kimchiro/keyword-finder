'use client';

import React from 'react';
import { colors } from '@/commons/styles';
import { RelatedKeywordsProps } from './types';
import {
  Container,
  Title,
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  RankBadge,
  KeywordText,
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

  const getSimilarityColor = (similarity: 'low' | 'medium' | 'high') => {
    switch (similarity) {
      case 'high':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.danger;
      default:
        return colors.gray500;
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
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>순위</TableHeaderCell>
              <TableHeaderCell>키워드</TableHeaderCell>
              <TableHeaderCell>카테고리</TableHeaderCell>
              <TableHeaderCell>경쟁도</TableHeaderCell>
              <TableHeaderCell>유사도</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword, index) => (
              <TableRow key={`${keyword.keyword}-${index}`}>
                <TableCell>
                  <RankBadge rank={keyword.rank}>#{keyword.rank}</RankBadge>
                </TableCell>
                <TableCell>
                  <KeywordText>{keyword.keyword}</KeywordText>
                </TableCell>
                <TableCell>
                  {keyword.category === 'related_search' ? '연관검색어' : keyword.category}
                </TableCell>
                <TableCell>
                  {getCompetitionText(keyword.competition)}
                </TableCell>
                <TableCell>
                  <SimilarityBadge color={getSimilarityColor(keyword.similarity)}>
                    {getSimilarityText(keyword.similarity)}
                  </SimilarityBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export type { RelatedKeywordsProps } from './types';
