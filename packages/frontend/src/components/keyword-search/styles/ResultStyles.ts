import styled from '@emotion/styled';

export const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

export const ResultSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

export const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const KeywordTag = styled.span`
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;
