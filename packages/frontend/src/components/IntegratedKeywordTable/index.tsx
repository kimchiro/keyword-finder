'use client';

import React from 'react';
import { IntegratedKeywordTableProps, FilterOptions, SortOptions } from './types';
import { useFilteredKeywords } from './hooks/useFilteredKeywords';
import {
  Container,
  Header,
  Title,
  FilterContainer,
  FilterGroup,
  FilterLabel,
  FilterCheckboxGroup,
  FilterCheckbox,
  FilterActions,
  ResetButton,
  StatsContainer,
  StatsText,
  SortContainer,
  SortSelect,
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  KeywordText,
  CategoryBadge,
  CompetitionBadge,
  SimilarityBadge,
  EmptyState,
  SortIcon,
} from './styles';

export const IntegratedKeywordTable: React.FC<IntegratedKeywordTableProps> = ({
  smartBlockKeywords,
  relatedKeywords,
  initialFilters,
  initialSort,
  showFilters = true,
}) => {
  // 디버깅: 전달받은 데이터 확인
  console.log('🔍 IntegratedKeywordTable Props:', {
    smartBlockKeywords: smartBlockKeywords?.length || 0,
    relatedKeywords: relatedKeywords?.length || 0,
    smartBlockData: smartBlockKeywords,
    relatedData: relatedKeywords
  });

  const {
    filteredKeywords,
    filters,
    sortOptions,
    updateFilters,
    updateSort,
    resetFilters,
    totalCount,
    filteredCount,
    availableCategories,
  } = useFilteredKeywords(smartBlockKeywords, relatedKeywords, initialFilters, initialSort);

  // 디버깅: 필터링된 결과 확인
  console.log('📊 Filtered Results:', {
    totalCount,
    filteredCount,
    filteredKeywords: filteredKeywords.length,
    availableCategories
  });

  // 모든 필터링된 키워드 표시 (maxItems 제한 제거)
  const displayKeywords = filteredKeywords;

  // 경쟁도 텍스트 변환
  const getCompetitionText = (competition: 'low' | 'medium' | 'high') => {
    switch (competition) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  // 유사도 텍스트 변환
  const getSimilarityText = (similarity: 'low' | 'medium' | 'high') => {
    switch (similarity) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };


  // 필터 업데이트 핸들러
  const handleFilterChange = (filterType: keyof FilterOptions, value: string, checked: boolean) => {
    const currentValues = filters[filterType] as string[];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    updateFilters({ [filterType]: newValues });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (field: SortOptions['field']) => {
    const newDirection = sortOptions.field === field && sortOptions.direction === 'asc' ? 'desc' : 'asc';
    updateSort({ field, direction: newDirection });
  };

  // 정렬 아이콘 표시
  const getSortIcon = (field: SortOptions['field']) => {
    if (sortOptions.field !== field) return undefined;
    return sortOptions.direction;
  };

  console.log('🎯 IntegratedKeywordTable 렌더링 조건 확인:', {
    totalCount,
    filteredCount,
    displayKeywordsLength: displayKeywords.length,
    shouldShowEmpty: totalCount === 0
  });

  if (totalCount === 0) {
    console.log('❌ 빈 상태 표시 - totalCount가 0입니다');
    return (
      <Container>
        <Header>
          <Title>🔗 통합 키워드 테이블</Title>
        </Header>
        <EmptyState>표시할 키워드 데이터가 없습니다.</EmptyState>
      </Container>
    );
  }

  console.log('✅ 정상 테이블 렌더링 - 데이터 있음');

  return (
    <Container>
      <Header>
        <Title>🔗 통합 키워드 테이블</Title>
        
        {showFilters && (
          <FilterContainer>

            <FilterGroup>
              <FilterLabel>경쟁도</FilterLabel>
              <FilterCheckboxGroup>
                {(['low', 'medium', 'high'] as const).map(competition => (
                  <FilterCheckbox key={competition}>
                    <input
                      type="checkbox"
                      checked={filters.competition.includes(competition)}
                      onChange={(e) => handleFilterChange('competition', competition, e.target.checked)}
                    />
                    {getCompetitionText(competition)}
                  </FilterCheckbox>
                ))}
              </FilterCheckboxGroup>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>카테고리</FilterLabel>
              <FilterCheckboxGroup>
                {availableCategories.map(category => (
                  <FilterCheckbox key={category}>
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={(e) => handleFilterChange('category', category, e.target.checked)}
                    />
                    {category}
                  </FilterCheckbox>
                ))}
              </FilterCheckboxGroup>
            </FilterGroup>

            <FilterActions>
              <ResetButton onClick={resetFilters}>
                필터 초기화
              </ResetButton>
            </FilterActions>
          </FilterContainer>
        )}

        <StatsContainer>
          <StatsText>
            전체 {totalCount}개 중 {filteredCount}개 표시
          </StatsText>
          
          <SortContainer>
            <span style={{ fontSize: '14px', color: '#666' }}>정렬:</span>
            <SortSelect
              value={`${sortOptions.field}-${sortOptions.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [SortOptions['field'], 'asc' | 'desc'];
                updateSort({ field, direction });
              }}
            >
              <option value="keyword-asc">키워드 (가나다순)</option>
              <option value="keyword-desc">키워드 (역순)</option>
            </SortSelect>
          </SortContainer>
        </StatsContainer>
      </Header>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell 
                sortable 
                onClick={() => handleSortChange('keyword')}
              >
                키워드
                <SortIcon direction={getSortIcon('keyword')} />
              </TableHeaderCell>
              <TableHeaderCell>카테고리</TableHeaderCell>
              <TableHeaderCell>경쟁도</TableHeaderCell>
              <TableHeaderCell>유사도</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayKeywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell>
                  <KeywordText>{keyword.keyword}</KeywordText>
                </TableCell>
                <TableCell align="center">
                  <CategoryBadge source={keyword.source}>{keyword.category}</CategoryBadge>
                </TableCell>
                <TableCell align="center">
                  <CompetitionBadge level={keyword.competition}>
                    {getCompetitionText(keyword.competition)}
                  </CompetitionBadge>
                </TableCell>
                <TableCell align="center">
                  <SimilarityBadge level={keyword.similarity}>
                    {getSimilarityText(keyword.similarity)}
                  </SimilarityBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export type { IntegratedKeywordTableProps } from './types';
