import React from 'react';
import { colors } from '@/commons/styles';
import { SmartBlockProps } from './types';
import {
  SmartBlockContainer,
  SmartBlockTitle,
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
} from './styles';

export const SmartBlock: React.FC<SmartBlockProps> = ({ keywords }) => {
  // 이미 필터링된 스마트블록 키워드 데이터 사용
  const smartBlockKeywords = keywords || [];
  const hasSmartBlockKeywords = smartBlockKeywords.length > 0;

  // 경쟁도 텍스트 변환 함수
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

  // 유사도 텍스트 변환 함수
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

  // 유사도 색상 함수
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

  if (!hasSmartBlockKeywords) {
    return (
      <SmartBlockContainer>
        <SmartBlockTitle>🧠 스마트블록 키워드</SmartBlockTitle>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textTertiary, fontSize: '14px' }}>
          스마트블록 키워드 데이터가 없습니다.
        </div>
      </SmartBlockContainer>
    );
  }

  return (
    <SmartBlockContainer>
      <SmartBlockTitle>🧠 스마트블록 키워드 (상위 {smartBlockKeywords.length}개)</SmartBlockTitle>
      
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
            {smartBlockKeywords.map((keyword, index) => (
              <TableRow key={`smartblock-${keyword.keyword}-${index}`}>
                <TableCell>
                  <RankBadge rank={keyword.rank}>#{keyword.rank}</RankBadge>
                </TableCell>
                <TableCell>
                  <KeywordText>{keyword.keyword}</KeywordText>
                </TableCell>
                <TableCell>
                  스마트블록
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
    </SmartBlockContainer>
  );
};

export type { SmartBlockProps } from './types';
