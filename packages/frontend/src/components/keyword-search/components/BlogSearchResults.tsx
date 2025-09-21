import React from 'react';
import styled from '@emotion/styled';
import { NaverSearchApiResponse } from '../types';

const ResultsContainer = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const SearchResultItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    background: #e8f4f8;
    border-color: #667eea;
  }
`;

const BlogTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const BlogDescription = styled.p`
  color: #4a5568;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;
`;

interface BlogSearchResultsProps {
  searchResults: NaverSearchApiResponse | null;
}

export const BlogSearchResults: React.FC<BlogSearchResultsProps> = ({
  searchResults,
}) => {
  // HTML 태그 제거 함수
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (!searchResults?.data?.items?.length) {
    return null;
  }

  return (
    <ResultsContainer>
      <SectionTitle>📝 네이버 블로그 검색 결과</SectionTitle>
      {searchResults.data.items.map((item, index) => (
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
            <span>{item.postdate}</span>
          </BlogMeta>
        </SearchResultItem>
      ))}
    </ResultsContainer>
  );
};
