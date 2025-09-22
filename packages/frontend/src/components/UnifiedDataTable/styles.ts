import styled from '@emotion/styled';

export const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};

  &:hover {
    background: ${props => props.active ? '#3b82f6' : '#f3f4f6'};
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

export const TableHeader = styled.thead`
  background: #f8f9fa;
`;

export const TableRow = styled.tr`
  &:nth-of-type(even) {
    background: #f9fafb;
  }
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const TableCell = styled.td<{ header?: boolean; weight?: string }>`
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: ${props => props.header ? '600' : props.weight || '400'};
  color: ${props => props.header ? '#374151' : '#1f2937'};
  
  &:first-of-type {
    padding-left: 20px;
  }
  
  &:last-of-type {
    padding-right: 20px;
  }
`;

export const RankBadge = styled.div<{ rank: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${props => {
    if (props.rank <= 3) return '#ffd700'; // 금색
    if (props.rank <= 10) return '#3b82f6'; // 파란색
    return '#666'; // 회색
  }};
  color: ${props => props.rank <= 3 ? '#333' : 'white'};
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CategoryBadge = styled.span`
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;

export const SimilarityBadge = styled.div<{ color: string }>`
  display: inline-block;
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 40px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 14px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
`;
