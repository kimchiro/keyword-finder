import React from 'react';
import { 
  TopKeywordsSection, 
  TopKeywordsTitle, 
  TopKeywordItem, 
  TopKeywordText, 
  TopKeywordBadge, 
  TopKeywordsEmpty 
} from '../styles/TopKeywordsStyles';
import { TopKeywordsProps } from '../types';

export const TopKeywords: React.FC<TopKeywordsProps> = ({ topKeywords }) => {
  return (
    <TopKeywordsSection>
      <TopKeywordsTitle>인기 키워드</TopKeywordsTitle>
      {topKeywords.length > 0 ? (
        topKeywords.slice(0, 10).map((keyword, index: number) => (
          <TopKeywordItem key={index}>
            <TopKeywordText>{keyword.text}</TopKeywordText>
            <TopKeywordBadge>{keyword.count}회</TopKeywordBadge>
          </TopKeywordItem>
        ))
      ) : (
        <TopKeywordsEmpty>인기 키워드 데이터가 없습니다</TopKeywordsEmpty>
      )}
    </TopKeywordsSection>
  );
};
