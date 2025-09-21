import React from 'react';
import { BlogSearchResultsProps } from './types';
import { stripHtml, formatPostDate } from './utils/htmlUtils';
import {
  ResultsContainer,
  SectionTitle,
  SearchResultItem,
  BlogTitle,
  BlogDescription,
  BlogMeta
} from './styles';

// 타입들 export
export type * from './types';

// 메인 BlogSearchResults 컴포넌트
export const BlogSearchResults: React.FC<BlogSearchResultsProps> = ({
  searchResults,
}) => {
  if (!searchResults) {
    return null;
  }

  // 백엔드 워크플로우에서 온 데이터인지 확인
  const isWorkflowData = 'items' in searchResults;
  const items = isWorkflowData ? searchResults.items : searchResults.data?.items;

  if (!items?.length) {
    return null;
  }

  return (
    <ResultsContainer>
      <SectionTitle>📝 네이버 블로그 검색 결과</SectionTitle>
      {items.map((item, index) => (
        <SearchResultItem key={index}>
          <BlogTitle>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {stripHtml(item.title)}
            </a>
          </BlogTitle>
          <BlogDescription>
            {stripHtml(item.description)}
          </BlogDescription>
          <BlogMeta>
            <span>
              블로거: <a href={item.bloggerlink} target="_blank" rel="noopener noreferrer">
                {item.bloggername}
              </a>
            </span>
            <span>{formatPostDate(item.postdate)}</span>
          </BlogMeta>
        </SearchResultItem>
      ))}
    </ResultsContainer>
  );
};