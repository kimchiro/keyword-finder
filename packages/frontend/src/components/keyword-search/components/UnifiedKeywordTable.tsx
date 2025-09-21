import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';

const TableContainer = styled.div`
  margin: 2rem 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 200px;
`;

const StatsRow = styled.div`
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr<{ trend?: 'rising' | 'falling' | 'new' | 'stable' }>`
  border-bottom: 1px solid #e2e8f0;
  
  ${({ trend }) => {
    switch (trend) {
      case 'rising':
        return 'background: linear-gradient(90deg, #c6f6d5 0%, transparent 100%);';
      case 'falling':
        return 'background: linear-gradient(90deg, #fed7d7 0%, transparent 100%);';
      case 'new':
        return 'background: linear-gradient(90deg, #bee3f8 0%, transparent 100%);';
      default:
        return '';
    }
  }}
  
  &:hover {
    background: #f7fafc;
  }
`;

const TableHeader2 = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: #e2e8f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const TrendBadge = styled.span<{ trend: 'rising' | 'falling' | 'new' | 'stable' | 'disappeared' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ trend }) => {
    switch (trend) {
      case 'rising':
        return 'background: #c6f6d5; color: #22543d;';
      case 'falling':
        return 'background: #fed7d7; color: #742a2a;';
      case 'new':
        return 'background: #bee3f8; color: #2a4365;';
      case 'stable':
        return 'background: #e2e8f0; color: #4a5568;';
      case 'disappeared':
        return 'background: #fbb6ce; color: #702459;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

const CategoryBadge = styled.span<{ category: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ category }) => {
    switch (category) {
      case 'autosuggest':
        return 'background: #e6fffa; color: #234e52;';
      case 'relatedKeywords':
        return 'background: #fef5e7; color: #744210;';
      case 'togetherSearched':
        return 'background: #f0fff4; color: #22543d;';
      case 'hotTopics':
        return 'background: #fdf2f8; color: #702459;';
      default:
        return 'background: #f7fafc; color: #4a5568;';
    }
  }}
`;

const InsightsBanner = styled.div`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const InsightItem = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

interface ScrapedKeyword {
  keyword_type: string;
  text: string;
  rank: number;
  grp: number;
  category: string;
  created_at: string;
}

interface KeywordData extends ScrapedKeyword {
  trend?: 'rising' | 'falling' | 'new' | 'stable' | 'disappeared';
  rankChange?: number;
  oldRank?: number;
}

interface UnifiedKeywordTableProps {
  integratedData?: {
    crawlingData?: {
      keywords: ScrapedKeyword[];
      total: number;
    };
    analysis?: {
      trendAnalysis: {
        rising: ScrapedKeyword[];
        falling: ScrapedKeyword[];
        stable: ScrapedKeyword[];
        new: ScrapedKeyword[];
        disappeared: ScrapedKeyword[];
      };
      rankingComparison: {
        improved: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
        declined: Array<{ keyword: ScrapedKeyword; oldRank: number; newRank: number; change: number }>;
        maintained: Array<{ keyword: ScrapedKeyword; rank: number }>;
      };
      categoryStats: {
        [key: string]: {
          count: number;
          percentage: number;
          topKeywords: ScrapedKeyword[];
        };
      };
      insights: string[];
    };
  } | null;
}

export const UnifiedKeywordTable: React.FC<UnifiedKeywordTableProps> = ({ integratedData }) => {
  const [sortBy, setSortBy] = useState<'rank' | 'text' | 'keyword_type' | 'created_at' | 'trend'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTrend, setFilterTrend] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const processedData = useMemo(() => {
    if (!integratedData?.crawlingData?.keywords) return [];

    const keywords = integratedData.crawlingData.keywords;
    const analysis = integratedData.analysis;

    // 트렌드 정보 추가
    const keywordsWithTrend = keywords.map(keyword => {
      let trend: KeywordData['trend'] = 'stable';
      let rankChange = 0;
      let oldRank = keyword.rank;

      if (analysis) {
        // 상승 키워드 확인
        const risingKeyword = analysis.trendAnalysis.rising.find(k => k.text === keyword.text);
        if (risingKeyword) trend = 'rising';

        // 하락 키워드 확인
        const fallingKeyword = analysis.trendAnalysis.falling.find(k => k.text === keyword.text);
        if (fallingKeyword) trend = 'falling';

        // 신규 키워드 확인
        const newKeyword = analysis.trendAnalysis.new.find(k => k.text === keyword.text);
        if (newKeyword) trend = 'new';

        // 랭킹 변화 확인
        const improvedKeyword = analysis.rankingComparison.improved.find(k => k.keyword.text === keyword.text);
        if (improvedKeyword) {
          rankChange = improvedKeyword.change;
          oldRank = improvedKeyword.oldRank;
        }

        const declinedKeyword = analysis.rankingComparison.declined.find(k => k.keyword.text === keyword.text);
        if (declinedKeyword) {
          rankChange = -declinedKeyword.change;
          oldRank = declinedKeyword.oldRank;
        }
      }

      return {
        ...keyword,
        trend,
        rankChange,
        oldRank
      };
    });

    return keywordsWithTrend;
  }, [integratedData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = processedData;

    // 카테고리 필터
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.keyword_type === filterCategory);
    }

    // 트렌드 필터
    if (filterTrend !== 'all') {
      filtered = filtered.filter(item => item.trend === filterTrend);
    }

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy] as string | number;
      let bValue: string | number = b[sortBy] as string | number;

      if (sortBy === 'created_at') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [processedData, sortBy, sortOrder, filterCategory, filterTrend, searchTerm]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getCategoryName = (type: string) => {
    switch (type) {
      case 'autosuggest': return '자동완성';
      case 'relatedKeywords': return '연관키워드';
      case 'togetherSearched': return '함께찾는';
      case 'hotTopics': return '인기주제';
      default: return type;
    }
  };

  const getTrendName = (trend: string) => {
    switch (trend) {
      case 'rising': return '상승';
      case 'falling': return '하락';
      case 'new': return '신규';
      case 'stable': return '안정';
      case 'disappeared': return '사라짐';
      default: return trend;
    }
  };

  if (!integratedData?.crawlingData?.keywords?.length) {
    return null;
  }

  const { analysis } = integratedData;
  const categories = [...new Set(processedData.map(item => item.keyword_type))];
  const trends = [...new Set(processedData.map(item => item.trend).filter(Boolean))];

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">모든 카테고리</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterTrend}
            onChange={(e) => setFilterTrend(e.target.value)}
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
            <TableHeader2 onClick={() => handleSort('rank')}>
              순위 {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHeader2>
            <TableHeader2 onClick={() => handleSort('text')}>
              키워드 {sortBy === 'text' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHeader2>
            <TableHeader2 onClick={() => handleSort('keyword_type')}>
              카테고리 {sortBy === 'keyword_type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHeader2>
            <TableHeader2>트렌드</TableHeader2>
            <TableHeader2>랭킹 변화</TableHeader2>
            <TableHeader2 onClick={() => handleSort('created_at')}>
              수집일 {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHeader2>
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
                <CategoryBadge category={keyword.keyword_type}>
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
                {keyword.rankChange !== 0 && (
                  <span style={{ 
                    color: keyword.rankChange > 0 ? '#22543d' : '#742a2a',
                    fontWeight: 'bold'
                  }}>
                    {keyword.rankChange > 0 ? '+' : ''}{keyword.rankChange}
                    {keyword.oldRank && ` (${keyword.oldRank} → ${keyword.rank})`}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {new Date(keyword.created_at).toLocaleDateString('ko-KR')}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
