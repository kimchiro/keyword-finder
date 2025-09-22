'use client';

import React from 'react';
import { UnifiedDataTableProps } from './types';
import {
  Container,
  Title,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  RankBadge,
  SimilarityBadge,
  EmptyState,
} from './styles';

export const UnifiedDataTable: React.FC<UnifiedDataTableProps> = ({ 
  relatedKeywords 
}) => {

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

  const hasRelatedData = relatedKeywords && relatedKeywords.length > 0;

  if (!hasRelatedData) {
    return (
      <Container>
        <Title>📊 통합 키워드 데이터</Title>
        <EmptyState>표시할 키워드 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>📊 연관 키워드 데이터 ({relatedKeywords?.length || 0}개)</Title>
      
      <TableContainer>
        <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>순위</TableCell>
                <TableCell header>연관 키워드</TableCell>
                <TableCell header>월간 검색량</TableCell>
                <TableCell header>블로그 누적</TableCell>
                <TableCell header>유사도</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {relatedKeywords?.map((keyword, index) => (
                <TableRow key={keyword.id || index}>
                  <TableCell>
                    <RankBadge rank={keyword.rankPosition}>#{keyword.rankPosition}</RankBadge>
                  </TableCell>
                  <TableCell weight="600">{keyword.relatedKeyword}</TableCell>
                  <TableCell>{formatNumber(keyword.monthlySearchVolume)}</TableCell>
                  <TableCell>{formatNumber(keyword.blogCumulativePosts)}</TableCell>
                  <TableCell>
                    <SimilarityBadge color={getSimilarityColor(keyword.similarityScore)}>
                      {keyword.similarityScore}
                    </SimilarityBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
      </TableContainer>
    </Container>
  );
};

export type { UnifiedDataTableProps } from './types';
