import React from 'react';
import styled from '@emotion/styled';
import { useNaverSearchCard } from './hooks/useNaverSearchCard';
import { 
  NaverSearchCard as SearchCard,
  NaverCardTitle,
  NaverSearchResultsList,
  NaverSearchResultItem,
  NaverResultTitle,
  NaverResultDescription,
  NaverResultMeta,
  NaverResultBlogger,
  NaverResultDate,
  NaverSearchEmpty
} from './styles/NaverSearchCardStyles';
import { NaverSearchCardProps } from './types/NaverSearchCardTypes';

const QueryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
`;

export const NaverSearchCard: React.FC<NaverSearchCardProps> = ({ searchData, query }) => {
  const { stripHtmlTags, formatDate, truncateText } = useNaverSearchCard();

  if (!searchData || !searchData.items || searchData.items.length === 0) {
    return (
      <SearchCard>
        <NaverCardTitle>네이버 블로그 검색 결과</NaverCardTitle>
        <NaverSearchEmpty>
          {query ? `"${query}"에 대한 검색 결과가 없습니다.` : '검색어를 입력하여 블로그 결과를 확인해보세요.'}
        </NaverSearchEmpty>
      </SearchCard>
    );
  }

  return (
    <SearchCard>
      <NaverCardTitle>네이버 블로그 검색 결과</NaverCardTitle>
      {query && <QueryBadge>검색어: {query}</QueryBadge>}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
        총 {searchData.total.toLocaleString()}개 결과 중 {searchData.items.length}개 표시
      </div>
      
      <NaverSearchResultsList>
        {searchData.items.map((item, index) => (
          <NaverSearchResultItem key={index}>
            <NaverResultTitle>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {stripHtmlTags(item.title)}
              </a>
            </NaverResultTitle>
            <NaverResultDescription>
              {truncateText(stripHtmlTags(item.description))}
            </NaverResultDescription>
            <NaverResultMeta>
              <NaverResultBlogger>
                블로거: <a href={item.bloggerlink} target="_blank" rel="noopener noreferrer">
                  {item.bloggername}
                </a>
              </NaverResultBlogger>
              <NaverResultDate>{formatDate(item.postdate)}</NaverResultDate>
            </NaverResultMeta>
          </NaverSearchResultItem>
        ))}
      </NaverSearchResultsList>
    </SearchCard>
  );
};
