import React from 'react';
import { SmartBlockProps } from './types';
import {
  SmartBlockContainer,
  SmartBlockTitle,
  SmartBlockScrollContainer,
  SmartBlockGrid,
  SmartBlockItem,
  KeywordText,
  KeywordStats,
  StatItem,
  StatLabel,
  StatValue,
  SimilarityBadge,
  RankBadge,
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
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (!hasSmartBlockKeywords) {
    return (
      <SmartBlockContainer>
        <SmartBlockTitle>🧠 스마트블록 키워드</SmartBlockTitle>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666', fontSize: '14px' }}>
          스마트블록 키워드 데이터가 없습니다.
        </div>
      </SmartBlockContainer>
    );
  }

  return (
    <SmartBlockContainer>
      <SmartBlockTitle>🧠 스마트블록 키워드 (상위 {smartBlockKeywords.length}개)</SmartBlockTitle>
      
      <SmartBlockScrollContainer>
        <SmartBlockGrid>
          {smartBlockKeywords.map((keyword, index) => (
            <SmartBlockItem key={`smartblock-${keyword.keyword}-${index}`}>
              <RankBadge rank={keyword.rank}>#{keyword.rank}</RankBadge>
              
              <KeywordText>{keyword.keyword}</KeywordText>
              
              <KeywordStats>
                <StatItem>
                  <StatLabel>카테고리</StatLabel>
                  <StatValue>스마트블록</StatValue>
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
            </SmartBlockItem>
          ))}
        </SmartBlockGrid>
      </SmartBlockScrollContainer>
    </SmartBlockContainer>
  );
};

export type { SmartBlockProps } from './types';
