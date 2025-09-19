import React from 'react';
import styled from '@emotion/styled';
import { NaverSearchApiResponse, NaverDatalabApiResponse } from '../types';

const ResultsContainer = styled.div`
  margin-top: 2rem;
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

const TrendContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
  border: 1px solid #bee3f8;
`;

const TrendItem = styled.div`
  margin-bottom: 1rem;
`;

const TrendTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const TrendData = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TrendDataPoint = styled.div`
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const TrendPeriod = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const TrendRatio = styled.div`
  font-weight: 600;
  color: #2d3748;
`;

interface NaverSearchResultsProps {
  searchResults: NaverSearchApiResponse | null;
  datalabResults: NaverDatalabApiResponse | null;
}

export const NaverSearchResults: React.FC<NaverSearchResultsProps> = ({
  searchResults,
  datalabResults,
}) => {
  // HTML 태그 제거 함수
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <ResultsContainer>
      {searchResults && searchResults.data && (
        <>
          <SectionTitle>네이버 블로그 검색 결과</SectionTitle>
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
        </>
      )}

      {datalabResults && datalabResults.data && (
        <TrendContainer>
          <SectionTitle>검색 트렌드 분석</SectionTitle>
          {datalabResults.data.results.map((result, index) => (
            <TrendItem key={index}>
              <TrendTitle>
                {result.title} ({result.keywords.join(', ')})
              </TrendTitle>
              <TrendData>
                {result.data.map((dataPoint, dataIndex) => (
                  <TrendDataPoint key={dataIndex}>
                    <TrendPeriod>{dataPoint.period}</TrendPeriod>
                    <TrendRatio>{dataPoint.ratio}%</TrendRatio>
                  </TrendDataPoint>
                ))}
              </TrendData>
            </TrendItem>
          ))}
        </TrendContainer>
      )}
    </ResultsContainer>
  );
};
