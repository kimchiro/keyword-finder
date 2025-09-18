/** @jsxImportSource @emotion/react */
import React from 'react';
import { ScrapingResult, KeywordData } from '../types';
import { 
  ResultsContainer, 
  ResultSection, 
  SectionTitle, 
  KeywordList, 
  KeywordTag 
} from '../styles/ResultStyles';
import { statsContainerStyles, statsTimeStyles } from '../styles/SearchStyles';

interface SearchResultsProps {
  results: ScrapingResult;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const groupKeywordsByType = (keywords: KeywordData[]) => {
    return keywords.reduce((acc, keyword) => {
      if (!acc[keyword.keyword_type]) {
        acc[keyword.keyword_type] = [];
      }
      acc[keyword.keyword_type].push(keyword);
      return acc;
    }, {} as Record<string, KeywordData[]>);
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'autosuggest': return '자동완성 키워드';
      case 'togetherSearched': return '함께 많이 찾는 키워드';
      case 'hotTopics': return '인기주제 키워드';
      default: return type;
    }
  };

  if (!results.success) {
    return null;
  }

  return (
    <ResultsContainer>
      <div css={statsContainerStyles}>
        <div>
          <strong>총 {results.stats.total}개 키워드 수집 완료</strong>
        </div>
        <div css={statsTimeStyles}>
          실행시간: {results.stats.duration}초
        </div>
      </div>

      {Object.entries(groupKeywordsByType(results.data)).map(([type, keywords]) => (
        <ResultSection key={type}>
          <SectionTitle>
            {getTypeTitle(type)} ({keywords.length}개)
          </SectionTitle>
          <KeywordList>
            {keywords
              .sort((a, b) => a.rank - b.rank)
              .map((keyword, index) => (
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
