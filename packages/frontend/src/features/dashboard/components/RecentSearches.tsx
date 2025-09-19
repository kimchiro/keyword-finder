import React from 'react';
import { useRecentSearches } from './hooks/useRecentSearches';
import { 
  RecentSearchesSection, 
  RecentSearchesList,
  RecentSearchesTitle, 
  RecentSearchItem, 
  RecentSearchText, 
  RecentSearchMeta, 
  RecentSearchBadge, 
  RecentSearchesEmpty 
} from './styles/RecentSearchesStyles';
import { RecentSearchesProps } from './types/RecentSearchesTypes';

export const RecentSearches: React.FC<RecentSearchesProps> = ({ recentSearches, onQueryClick }) => {
  const { formatDate } = useRecentSearches();

  return (
    <RecentSearchesSection>
      <RecentSearchesTitle>최근 검색 ({recentSearches.length}개)</RecentSearchesTitle>
      <RecentSearchesList>
        {recentSearches.length > 0 ? (
          recentSearches.map((search, index) => (
            <RecentSearchItem key={index} onClick={() => onQueryClick(search.query)}>
              <div>
                <RecentSearchText>{search.query}</RecentSearchText>
                <RecentSearchMeta>
                  {formatDate(search.timestamp)}
                </RecentSearchMeta>
              </div>
              <RecentSearchBadge>{search.totalKeywords}개</RecentSearchBadge>
            </RecentSearchItem>
          ))
        ) : (
          <RecentSearchesEmpty>최근 검색 기록이 없습니다</RecentSearchesEmpty>
        )}
      </RecentSearchesList>
    </RecentSearchesSection>
  );
};
