import styled from '@emotion/styled';

export const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

export const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

export const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #e9ecef;
  }
`;

export const TableRow = styled.tr`
  &:nth-of-type(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e8f4f8;
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
`;

export const KeywordCell = styled(TableCell)`
  font-weight: 600;
  color: #2d3748;
`;

export const NumberCell = styled(TableCell)`
  text-align: right;
  font-family: 'Courier New', monospace;
`;

export const CompetitionBadge = styled.span<{ level: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.level) {
      case '높음': return '#ef4444';
      case '중간': return '#f59e0b';
      case '낮음': return '#10b981';
      default: return '#6b7280';
    }
  }};
`;

export const SortIcon = styled.span<{ active: boolean; direction?: 'asc' | 'desc' }>`
  margin-left: 0.5rem;
  opacity: ${props => props.active ? 1 : 0.3};
  
  &::after {
    content: ${props => {
      if (!props.active) return '"↕"';
      return props.direction === 'asc' ? '"↑"' : '"↓"';
    }};
  }
`;
