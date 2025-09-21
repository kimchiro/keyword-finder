import styled from '@emotion/styled';
import { TrendType, KeywordType } from '@/commons/enums';

export const TableContainer = styled.div`
  margin: 2rem 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

export const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
`;

export const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 200px;
`;

export const StatsRow = styled.div`
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: #f8f9fa;
`;

export const TableRow = styled.tr<{ trend?: TrendType }>`
  border-bottom: 1px solid #e2e8f0;
  
  ${({ trend }) => {
    switch (trend) {
      case TrendType.RISING:
        return 'background: linear-gradient(90deg, #c6f6d5 0%, transparent 100%);';
      case TrendType.FALLING:
        return 'background: linear-gradient(90deg, #fed7d7 0%, transparent 100%);';
      case TrendType.NEW:
        return 'background: linear-gradient(90deg, #bee3f8 0%, transparent 100%);';
      default:
        return '';
    }
  }}
  
  &:hover {
    background: #f7fafc;
  }
`;

export const TableHeaderCell = styled.th`
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

export const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

export const TrendBadge = styled.span<{ trend: TrendType }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ trend }) => {
    switch (trend) {
      case TrendType.RISING:
        return 'background: #c6f6d5; color: #22543d;';
      case TrendType.FALLING:
        return 'background: #fed7d7; color: #742a2a;';
      case TrendType.NEW:
        return 'background: #bee3f8; color: #2a4365;';
      case TrendType.STABLE:
        return 'background: #e2e8f0; color: #4a5568;';
      case TrendType.DISAPPEARED:
        return 'background: #fbb6ce; color: #702459;';
      default:
        return 'background: #e2e8f0; color: #4a5568;';
    }
  }}
`;

export const CategoryBadge = styled.span<{ category: KeywordType }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ category }) => {
    switch (category) {
      case KeywordType.AUTOSUGGEST:
        return 'background: #e6fffa; color: #234e52;';
      case KeywordType.RELATED_KEYWORDS:
        return 'background: #fef5e7; color: #744210;';
      case KeywordType.TOGETHER_SEARCHED:
        return 'background: #f0fff4; color: #22543d;';
      case KeywordType.HOT_TOPICS:
        return 'background: #fdf2f8; color: #702459;';
      default:
        return 'background: #f7fafc; color: #4a5568;';
    }
  }}
`;

export const InsightsBanner = styled.div`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const InsightItem = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;
