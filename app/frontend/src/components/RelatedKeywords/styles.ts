import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';

export const Container = styled.div`
  background: ${colors.bgCard};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  box-shadow: ${shadow.md};
  margin-bottom: ${spacing.xl};
  border: 1px solid ${colors.borderPrimary};
`;

export const Title = styled.h2`
  ${fontStyles.title}
  margin: 0 0 ${spacing.xl} 0;
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.borderPrimary};
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.borderPrimary};
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.gray100};
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.gray400};
    border-radius: ${borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray500};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${colors.bgCard};
  min-width: 600px;
`;

export const TableHeader = styled.thead`
  background: ${colors.bgSecondary};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.borderPrimary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${colors.bgSecondary};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: ${spacing.md} ${spacing.lg};
  text-align: left;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textSecondary};
  border-bottom: 2px solid ${colors.borderPrimary};
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
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${fontSize.sm};
  color: ${colors.textPrimary};
  vertical-align: middle;
  
  &:first-of-type {
    text-align: center;
  }
  
  &:nth-of-type(4) {
    text-align: center;
    font-weight: ${fontWeight.medium};
  }
  
  &:nth-of-type(5) {
    text-align: center;
  }
`;

export const RankBadge = styled.div<{ rank: number }>`
  background: ${props => {
    if (props.rank <= 3) return colors.warning; // 상위 3위
    if (props.rank <= 10) return colors.secondary; // 상위 10위
    return colors.gray500; // 나머지
  }};
  color: ${props => props.rank <= 3 ? colors.textPrimary : colors.textInverse};
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.bold};
  margin: 0 auto;
  box-shadow: ${shadow.sm};
`;


export const KeywordText = styled.div`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textPrimary};
  word-break: break-word;
  line-height: 1.4;
`;





export const SimilarityBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.xl};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 50px;
  display: inline-block;
`;

export const EmptyState = styled.div`
  ${fontStyles.content}
  text-align: center;
  padding: ${spacing.xl} ${spacing.lg};
  background: ${colors.bgCard};
  border-radius: ${borderRadius.md};
  border: 1px dashed ${colors.borderPrimary};
  color: ${colors.textTertiary};
`;
