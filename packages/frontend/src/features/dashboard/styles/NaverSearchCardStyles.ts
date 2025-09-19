import styled from '@emotion/styled';

export const NaverSearchCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  height: auto;
`;

export const NaverCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const NaverSearchResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

export const NaverSearchResultItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:hover {
    background: #e8f4f8;
    border-color: #667eea;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const NaverResultTitle = styled.h4`
  font-size: 1rem;
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

export const NaverResultDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

export const NaverResultMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const NaverResultBlogger = styled.span`
  font-weight: 500;
  color: #374151;
`;

export const NaverResultDate = styled.span`
  color: #9ca3af;
`;

export const NaverSearchEmpty = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
  font-style: italic;
`;
