import styled from '@emotion/styled';

export const TopKeywordsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const TopKeywordsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const TopKeywordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

export const TopKeywordText = styled.span`
  font-weight: 500;
  color: #374151;
`;

export const TopKeywordBadge = styled.span`
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const TopKeywordsEmpty = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
  font-style: italic;
`;
