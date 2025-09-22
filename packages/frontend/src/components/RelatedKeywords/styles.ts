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
  background: white;
  min-width: 600px;
`;

export const TableHeader = styled.thead`
  background: #f8f9fa;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
  
  &:first-of-type {
    width: 80px;
    text-align: center;
  }
  
  &:nth-of-type(2) {
    min-width: 200px;
  }
  
  &:nth-of-type(3) {
    width: 120px;
  }
  
  &:nth-of-type(4) {
    width: 100px;
    text-align: center;
  }
  
  &:nth-of-type(5) {
    width: 100px;
    text-align: center;
  }
`;

export const TableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
  
  &:first-of-type {
    text-align: center;
  }
  
  &:nth-of-type(4) {
    text-align: center;
    font-weight: 500;
  }
  
  &:nth-of-type(5) {
    text-align: center;
  }
`;

export const RankBadge = styled.div<{ rank: number }>`
  background: ${props => {
    if (props.rank <= 3) return '#ffd700'; // 금색
    if (props.rank <= 10) return '#2563eb'; // 파란색
    return '#666'; // 회색
  }};
  color: ${props => props.rank <= 3 ? '#333' : 'white'};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;


export const KeywordText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  word-break: break-word;
  line-height: 1.4;
`;





export const SimilarityBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  min-width: 50px;
  display: inline-block;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
`;
