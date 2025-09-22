/** @jsxImportSource @emotion/react */
import React from 'react';
import { SearchResultsProps } from './types';
import { groupKeywordsByCategory } from './utils/keywordUtils';
import { 
  ResultsContainer, 
  ResultSection, 
  SectionTitle, 
  KeywordList, 
  KeywordTag,
  statsContainerStyles,
  statsTimeStyles
} from './styles';

// 타입들 export
export type * from './types';

// 메인 SearchResults 컴포넌트
export const SearchResults: React.FC<SearchResultsProps> = ({ scrapingData }) => {
  if (!scrapingData?.keywords || scrapingData.keywords.length === 0) {
    return null;
  }

  const groupedKeywords = groupKeywordsByCategory(scrapingData.keywords);

  return (
    <ResultsContainer>
      <div css={statsContainerStyles}>
        <div>
          <strong>총 {scrapingData.totalKeywords}개 키워드 수집 완료</strong>
        </div>
        <div css={statsTimeStyles}>
          실행시간: {scrapingData.executionTime.toFixed(2)}초
        </div>
      </div>

      {Object.entries(groupedKeywords).map(([category, keywords]) => (
        <ResultSection key={category}>
          <SectionTitle>
            {category} ({keywords.length}개)
          </SectionTitle>
          <KeywordList>
            {keywords.map((keyword, index) => (
              <KeywordTag key={index}>
                {keyword.keyword}
              </KeywordTag>
            ))}
          </KeywordList>
        </ResultSection>
      ))}
    </ResultsContainer>
  );
};