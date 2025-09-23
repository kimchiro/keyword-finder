import React, { useState, useMemo } from 'react';
import {
  SortType,
  SortOrder,
  SORT_TYPE_NAMES
} from '@/commons/enums';
import { colors } from '@/commons/styles';
import { 
  UnifiedKeywordTableProps, 
  FilterState, 
  SortState 
} from './types';
import { 
  processKeywordsWithTrend,
  getCategoryName,
  getTrendName,
  getKeywordTypeEnum,
  formatDate
} from './utils/keywordProcessor';
import { filterAndSortKeywords } from './utils/filterSort';
import {
  TableContainer,
  TableHeader,
  TableTitle,
  FilterControls,
  FilterSelect,
  SearchInput,
  StatsRow,
  StatItem,
  StatValue,
  StatLabel,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  TrendBadge,
  CategoryBadge,
  InsightsBanner,
  InsightItem
} from './styles';

// 타입들 export
export type * from './types';

// 메인 UnifiedKeywordTable 컴포넌트
export const UnifiedKeywordTable: React.FC<UnifiedKeywordTableProps> = ({ integratedData }) => {
  const [sortState, setSortState] = useState<SortState>({
    sortBy: SortType.RANK,
    sortOrder: SortOrder.ASC
  });
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    trend: 'all',
    searchTerm: ''
  });

  const processedData = useMemo(() => {
    return processKeywordsWithTrend(integratedData || {});
  }, [integratedData]);

  const filteredAndSortedData = useMemo(() => {
    return filterAndSortKeywords(processedData, filters, sortState);
  }, [processedData, filters, sortState]);

  const handleSort = (column: SortType) => {
    setSortState(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === SortOrder.ASC 
        ? SortOrder.DESC 
        : SortOrder.ASC
    }));
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!integratedData?.crawlingData?.keywords?.length) {
    return null;
  }

  const { analysis } = integratedData;
  const categories = [...new Set(processedData.map(item => item.keyword_type))];
  const trends = [...new Set(processedData.map(item => item.trend).filter(Boolean))] as string[];

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          키워드 분석 테이블 ({filteredAndSortedData.length}/{processedData.length})
        </TableTitle>
        <FilterControls>
          <SearchInput
            type="text"
            placeholder="키워드 검색..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          <FilterSelect
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">모든 카테고리</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filters.trend}
            onChange={(e) => handleFilterChange('trend', e.target.value)}
          >
            <option value="all">모든 트렌드</option>
            {trends.map(trend => (
              <option key={trend} value={trend}>
                {getTrendName(trend)}
              </option>
            ))}
          </FilterSelect>
        </FilterControls>
      </TableHeader>

      {/* 인사이트 배너 */}
      {analysis?.insights && analysis.insights.length > 0 && (
        <InsightsBanner>
          {analysis.insights.map((insight, index) => (
            <InsightItem key={index}>{insight}</InsightItem>
          ))}
        </InsightsBanner>
      )}

      {/* 통계 요약 */}
      {analysis && (
        <StatsRow>
          <StatItem>
            <StatValue>{analysis.trendAnalysis.rising.length}</StatValue>
            <StatLabel>상승 키워드</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{analysis.trendAnalysis.new.length}</StatValue>
            <StatLabel>신규 키워드</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{analysis.trendAnalysis.falling.length}</StatValue>
            <StatLabel>하락 키워드</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{Object.keys(analysis.categoryStats).length}</StatValue>
            <StatLabel>카테고리 수</StatLabel>
          </StatItem>
        </StatsRow>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell onClick={() => handleSort(SortType.RANK)}>
              {SORT_TYPE_NAMES[SortType.RANK]} {sortState.sortBy === SortType.RANK && (sortState.sortOrder === SortOrder.ASC ? '↑' : '↓')}
            </TableHeaderCell>
            <TableHeaderCell onClick={() => handleSort(SortType.TEXT)}>
              {SORT_TYPE_NAMES[SortType.TEXT]} {sortState.sortBy === SortType.TEXT && (sortState.sortOrder === SortOrder.ASC ? '↑' : '↓')}
            </TableHeaderCell>
            <TableHeaderCell onClick={() => handleSort(SortType.KEYWORD_TYPE)}>
              {SORT_TYPE_NAMES[SortType.KEYWORD_TYPE]} {sortState.sortBy === SortType.KEYWORD_TYPE && (sortState.sortOrder === SortOrder.ASC ? '↑' : '↓')}
            </TableHeaderCell>
            <TableHeaderCell>트렌드</TableHeaderCell>
            <TableHeaderCell>랭킹 변화</TableHeaderCell>
            <TableHeaderCell onClick={() => handleSort(SortType.CREATED_AT)}>
              {SORT_TYPE_NAMES[SortType.CREATED_AT]} {sortState.sortBy === SortType.CREATED_AT && (sortState.sortOrder === SortOrder.ASC ? '↑' : '↓')}
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {filteredAndSortedData.map((keyword, index) => (
            <TableRow key={`${keyword.text}-${keyword.rank}-${index}`} trend={keyword.trend}>
              <TableCell>#{keyword.rank}</TableCell>
              <TableCell>
                <strong>{keyword.text}</strong>
              </TableCell>
              <TableCell>
                <CategoryBadge category={getKeywordTypeEnum(keyword.keyword_type)}>
                  {getCategoryName(keyword.keyword_type)}
                </CategoryBadge>
              </TableCell>
              <TableCell>
                {keyword.trend && (
                  <TrendBadge trend={keyword.trend}>
                    {getTrendName(keyword.trend)}
                  </TrendBadge>
                )}
              </TableCell>
              <TableCell>
                {keyword.rankChange !== undefined && keyword.rankChange !== 0 && (
                  <span style={{ 
                    color: keyword.rankChange > 0 ? colors.successDark : colors.dangerDark,
                    fontWeight: 'bold'
                  }}>
                    {keyword.rankChange > 0 ? '+' : ''}{keyword.rankChange}
                    {keyword.oldRank && ` (${keyword.oldRank} → ${keyword.rank})`}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {formatDate(keyword.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};