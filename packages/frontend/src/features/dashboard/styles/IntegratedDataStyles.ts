import styled from '@emotion/styled';

export const IntegratedDataContainer = styled.div`
  margin-top: 2rem;
`;

export const IntegratedDataTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const IntegratedDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const DataCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const DataCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4a5568;
`;

export const IntegratedKeywordItem = styled.div<{ isLast?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #e2e8f0'};
`;

export const IntegratedKeywordText = styled.span`
  font-size: 0.9rem;
`;

export const KeywordMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
`;

export const SearchResultItem = styled.div<{ isLast?: boolean }>`
  padding: 0.75rem 0;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #e2e8f0'};
`;

export const SearchResultTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const SearchResultMeta = styled.div`
  font-size: 0.75rem;
  color: #718096;
`;

export const TrendDataContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

export const TrendDataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TrendDataItem = styled.div`
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border-radius: 20px;
  font-size: 0.875rem;
`;

export const RelatedKeywordsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const RelatedKeywordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const RelatedKeywordItem = styled.div`
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const RelatedKeywordTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const RelatedKeywordStat = styled.div`
  font-size: 0.75rem;
  color: #718096;
`;
