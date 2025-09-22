'use client';

import React from 'react';
import { AdultKeywordCheckProps } from './types';
import { IntentAnalysisData } from '@/commons/types';
import {
  Container,
  Title,
  CheckCard,
  StatusIcon,
  StatusLabel,
  StatusDescription,
  WarningBadge,
  SafeBadge,
} from './styles';

export const AdultKeywordCheck: React.FC<AdultKeywordCheckProps> = ({ keyword, intentAnalysis }) => {
  // 성인 키워드 여부를 판단하는 로직 (실제로는 백엔드에서 제공해야 함)
  const checkAdultKeyword = (keyword: string, intentAnalysis: IntentAnalysisData | null) => {
    // 임시 로직: 특정 키워드나 상업성이 높은 경우 성인 키워드로 판단
    const adultKeywords = ['성인', '19금', '야동', '포르노', '섹스', '성관계'];
    const hasAdultKeyword = adultKeywords.some(adult => keyword.toLowerCase().includes(adult));
    
    // 상업성이 매우 높고 특정 조건을 만족하는 경우
    const highCommercial = intentAnalysis?.commercialRatio ? intentAnalysis.commercialRatio > 80 : false;
    
    return hasAdultKeyword || (highCommercial && keyword.includes('성인'));
  };

  const isAdultKeyword = checkAdultKeyword(keyword || '', intentAnalysis);

  return (
    <Container>
      <Title>성인 키워드 여부</Title>
      <CheckCard isAdult={isAdultKeyword}>
        <StatusIcon>
          {isAdultKeyword ? '🔞' : '✅'}
        </StatusIcon>
        <StatusLabel isAdult={isAdultKeyword}>
          {isAdultKeyword ? '성인 키워드' : '일반 키워드'}
        </StatusLabel>
        <StatusDescription>
          {isAdultKeyword 
            ? '이 키워드는 성인 콘텐츠와 관련될 수 있습니다.' 
            : '이 키워드는 일반적인 검색어입니다.'
          }
        </StatusDescription>
        {isAdultKeyword ? (
          <WarningBadge>주의 필요</WarningBadge>
        ) : (
          <SafeBadge>안전</SafeBadge>
        )}
      </CheckCard>
    </Container>
  );
};

export type { AdultKeywordCheckProps } from './types';
