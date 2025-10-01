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
  blogSearchData,
}) => {
  if (!blogSearchData?.items || blogSearchData.items.length === 0) {
    return null;
  }

  return (
    <ResultsContainer>
      <SectionTitle>📝 네이버 블로그 검색 결과 최근10개</SectionTitle>
      {blogSearchData.items.map((item, index) => (
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