'use client';

import React from 'react';
import { useRelatedKeywordsTable } from './hooks/useRelatedKeywordsTable';
import { 
  TableContainer, 
  TableTitle, 
  TableWrapper, 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell, 
  KeywordCell, 
  NumberCell, 
  CompetitionBadge, 
  SortIcon 
} from './styles/RelatedKeywordsTableStyles';
import { RelatedKeywordsTableProps } from './types';

export const RelatedKeywordsTable: React.FC<RelatedKeywordsTableProps> = ({
  data,
  title = "연관 키워드"
}) => {
  const {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
    formatNumber,
    getCompetitionLevel,
    formatCtr,
  } = useRelatedKeywordsTable({ data });

  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <TableTitle>{title}</TableTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          연관 키워드 데이터가 없습니다.
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableTitle>{title}</TableTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('relKeyword')}>
                키워드
                <SortIcon 
                  active={sortField === 'relKeyword'} 
                  direction={sortField === 'relKeyword' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyPcQcCnt')}>
                PC 검색량
                <SortIcon 
                  active={sortField === 'monthlyPcQcCnt'} 
                  direction={sortField === 'monthlyPcQcCnt' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyMobileQcCnt')}>
                모바일 검색량
                <SortIcon 
                  active={sortField === 'monthlyMobileQcCnt'} 
                  direction={sortField === 'monthlyMobileQcCnt' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyAvePcClkCnt')}>
                PC 클릭수
                <SortIcon 
                  active={sortField === 'monthlyAvePcClkCnt'} 
                  direction={sortField === 'monthlyAvePcClkCnt' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyAveMobileClkCnt')}>
                모바일 클릭수
                <SortIcon 
                  active={sortField === 'monthlyAveMobileClkCnt'} 
                  direction={sortField === 'monthlyAveMobileClkCnt' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyAvePcCtr')}>
                PC CTR
                <SortIcon 
                  active={sortField === 'monthlyAvePcCtr'} 
                  direction={sortField === 'monthlyAvePcCtr' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('monthlyAveMobileCtr')}>
                모바일 CTR
                <SortIcon 
                  active={sortField === 'monthlyAveMobileCtr'} 
                  direction={sortField === 'monthlyAveMobileCtr' ? sortDirection : undefined} 
                />
              </TableHeader>
              <TableHeader onClick={() => handleSort('compIdx')}>
                경쟁도
                <SortIcon 
                  active={sortField === 'compIdx'} 
                  direction={sortField === 'compIdx' ? sortDirection : undefined} 
                />
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((keyword, index) => (
              <TableRow key={`${keyword.relKeyword}-${index}`}>
                <KeywordCell>{keyword.relKeyword}</KeywordCell>
                <NumberCell>{formatNumber(keyword.monthlyPcQcCnt)}</NumberCell>
                <NumberCell>{formatNumber(keyword.monthlyMobileQcCnt)}</NumberCell>
                <NumberCell>{formatNumber(keyword.monthlyAvePcClkCnt)}</NumberCell>
                <NumberCell>{formatNumber(keyword.monthlyAveMobileClkCnt)}</NumberCell>
                <NumberCell>{formatCtr(keyword.monthlyAvePcCtr)}</NumberCell>
                <NumberCell>{formatCtr(keyword.monthlyAveMobileCtr)}</NumberCell>
                <TableCell>
                  <CompetitionBadge level={getCompetitionLevel(keyword.compIdx)}>
                    {getCompetitionLevel(keyword.compIdx)}
                  </CompetitionBadge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};