import styled from '@emotion/styled';

export const RecentSearchesSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: auto;
`;

export const RecentSearchesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const RecentSearchesTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const RecentSearchItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const RecentSearchText = styled.div`
  font-weight: 500;
  color: #374151;
`;

export const RecentSearchMeta = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

export const RecentSearchBadge = styled.span`
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const RecentSearchesEmpty = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
  font-style: italic;
`;
