/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const ResultsContainer = styled.div`
  margin: 2rem 0;
`;

export const ResultSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const KeywordTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

export const statsContainerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
`;

export const statsTimeStyles = css`
  color: #6b7280;
  font-size: 0.875rem;
`;
