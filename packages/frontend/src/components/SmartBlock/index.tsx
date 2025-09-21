import React from 'react';
import { SmartBlockProps } from './types';
import {
  SmartBlockContainer,
  SmartBlockHeader,
  SmartBlockTitle,
  SmartBlockGrid,
  SmartBlockItem,
  KeywordText,
  CategoryBadge,
  ScoreText,
} from './styles';

export const SmartBlock: React.FC<SmartBlockProps> = ({ scrapingData }) => {
  if (!scrapingData?.keywords || scrapingData.keywords.length === 0) {
    return (
      <SmartBlockContainer>
        <SmartBlockHeader>
          <SmartBlockTitle>🧠 스마트블록 키워드</SmartBlockTitle>
        </SmartBlockHeader>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          스크래핑된 키워드가 없습니다.
        </div>
      </SmartBlockContainer>
    );
  }

  // smartblock 타입의 키워드만 필터링
  const smartBlockKeywords = scrapingData.keywords.filter(
    keyword => keyword.category === 'smartblock'
  );

  return (
    <SmartBlockContainer>
      <SmartBlockHeader>
        <SmartBlockTitle>🧠 스마트블록 키워드</SmartBlockTitle>
        <div style={{ fontSize: '14px', color: '#666' }}>
          총 {smartBlockKeywords.length}개 키워드
        </div>
      </SmartBlockHeader>
      
      <SmartBlockGrid>
        {smartBlockKeywords.map((keyword, index) => (
          <SmartBlockItem key={`${keyword.keyword}-${index}`}>
            <KeywordText>{keyword.keyword}</KeywordText>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <CategoryBadge>{keyword.category}</CategoryBadge>
              {keyword.score && (
                <ScoreText>점수: {keyword.score}</ScoreText>
              )}
            </div>
          </SmartBlockItem>
        ))}
      </SmartBlockGrid>
    </SmartBlockContainer>
  );
};

export type { SmartBlockProps } from './types';
