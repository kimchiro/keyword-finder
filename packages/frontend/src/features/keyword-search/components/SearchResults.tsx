/** @jsxImportSource @emotion/react */
import React from 'react';
import { SearchResultsProps, KeywordData } from '../types';
import { 
  ResultsContainer, 
  ResultSection, 
  SectionTitle, 
  KeywordList, 
  KeywordTag 
} from '../styles/ResultStyles';
import { statsContainerStyles, statsTimeStyles } from '../styles/SearchStyles';

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const groupKeywordsByType = (keywords: KeywordData[]) => {
    // "추가" 텍스트가 포함된 키워드 필터링 및 중복 제거
    const filteredKeywords = keywords
      .filter(keyword => 
        keyword && 
        keyword.text && 
        typeof keyword.text === 'string' && 
        keyword.text.trim() !== '' &&
        !keyword.text.includes('추가') &&
        keyword.keyword_type &&
        typeof keyword.keyword_type === 'string'
      )
      .reduce((acc, keyword) => {
        // 중복 제거 (text 기준)
        const existingIndex = acc.findIndex(item => item && item.text === keyword.text);
        if (existingIndex === -1) {
          acc.push(keyword);
        }
        return acc;
      }, [] as KeywordData[]);

    return filteredKeywords.reduce((acc, keyword) => {
      const keywordType = keyword.keyword_type || 'unknown';
      if (!acc[keywordType]) {
        acc[keywordType] = [];
      }
      acc[keywordType].push(keyword);
      return acc;
    }, {} as Record<string, KeywordData[]>);
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'autosuggest': return '자동완성 키워드';
      case 'togetherSearched': return '함께 많이 찾는 키워드';
      case 'hotTopics': return '인기주제 키워드';
      case 'relatedKeywords': return '연관검색어';
      case 'unknown': return '기타 키워드';
      default: return type || '알 수 없는 타입';
    }
  };

  if (!results?.success || !results?.keywords) {
    return null;
  }

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

      {Object.entries(groupKeywordsByType(results.keywords || [])).map(([type, keywords]) => (
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
