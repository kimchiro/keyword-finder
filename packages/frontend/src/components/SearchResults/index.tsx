/** @jsxImportSource @emotion/react */
import React from 'react';
import { SearchResultsProps } from './types';
import { groupKeywordsByType, getTypeTitle, sortKeywordsByRank } from './utils/keywordUtils';
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
export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (!results?.success || !results?.keywords) {
    return null;
  }

  const groupedKeywords = groupKeywordsByType(results.keywords || []);

  return (
    <ResultsContainer>
      <div css={statsContainerStyles}>
        <div>
          <strong>총 {results.totalKeywords || results.stats?.total || 0}개 키워드 수집 완료</strong>
        </div>
        <div css={statsTimeStyles}>
          실행시간: {results.stats?.duration || 0}초
        </div>
      </div>

      {Object.entries(groupedKeywords).map(([type, keywords]) => (
        <ResultSection key={type}>
          <SectionTitle>
            {getTypeTitle(type)} ({keywords.length}개)
          </SectionTitle>
          <KeywordList>
            {sortKeywordsByRank(keywords).map((keyword, index) => (
              <KeywordTag key={index}>
                {keyword.text}
              </KeywordTag>
            ))}
          </KeywordList>
        </ResultSection>
      ))}
    </ResultsContainer>
  );
};