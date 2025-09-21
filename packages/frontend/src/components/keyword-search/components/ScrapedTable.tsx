import React from 'react';
import styled from '@emotion/styled';
import { ComprehensiveAnalysisData } from '../types/analysis';

const TableContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const TablePlaceholder = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

interface ScrapedTableProps {
  comprehensiveData?: ComprehensiveAnalysisData | null;
}

export const ScrapedTable: React.FC<ScrapedTableProps> = ({
  comprehensiveData,
}) => {
  const relatedKeywords = comprehensiveData?.relatedKeywords || [];

  if (relatedKeywords.length === 0) {
    return null;
  }

  return (
    <TableContainer>
      <TableTitle>🔗 연관 키워드 상세 분석</TableTitle>
      <TablePlaceholder>
        연관 키워드 테이블 ({relatedKeywords.length}개 키워드)
      </TablePlaceholder>
    </TableContainer>
  );
};
