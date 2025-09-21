import styled from '@emotion/styled';

export const ResultsContainer = styled.div`
  margin: 2rem 0;
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
`;

export const SearchResultItem = styled.div`
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

export const BlogTitle = styled.h4`
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

export const BlogDescription = styled.p`
  color: #4a5568;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

export const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
