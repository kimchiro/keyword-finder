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

export const TabContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
  border-bottom: 1px solid ${colors.borderPrimary};
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: ${spacing.sm} ${spacing.lg};
  border: none;
  background: ${props => props.active ? colors.secondary : 'transparent'};
  color: ${props => props.active ? colors.textInverse : colors.textSecondary};
  border-radius: ${borderRadius.md} ${borderRadius.md} 0 0;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.active ? colors.secondary : 'transparent'};

  &:hover {
    background: ${props => props.active ? colors.secondary : colors.bgSecondary};
  }
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
  min-width: 600px;
  background: ${colors.bgCard};
`;

export const TableHeader = styled.thead`
  background: ${colors.bgSecondary};
`;

export const TableRow = styled.tr`
  &:nth-of-type(even) {
    background: ${colors.bgSecondary};
  }
  
  &:hover {
    background: ${colors.bgTertiary};
  }
`;

export const TableCell = styled.td<{ header?: boolean; weight?: string }>`
  padding: ${spacing.sm} ${spacing.md};
  text-align: left;
  border-bottom: 1px solid ${colors.borderPrimary};
  font-size: ${fontSize.sm};
  font-weight: ${props => props.header ? fontWeight.semibold : props.weight || fontWeight.normal};
  color: ${props => props.header ? colors.textSecondary : colors.textPrimary};
  
  &:first-of-type {
    padding-left: ${spacing.lg};
  }
  
  &:last-of-type {
    padding-right: ${spacing.lg};
  }
`;

export const RankBadge = styled.div<{ rank: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${props => {
    if (props.rank <= 3) return colors.warning;
    if (props.rank <= 10) return colors.secondary;
    return colors.gray500;
  }};
  color: ${props => props.rank <= 3 ? colors.textPrimary : colors.textInverse};
  border-radius: ${borderRadius.full};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.bold};
  border: 2px solid ${colors.bgCard};
  box-shadow: ${shadow.sm};
`;

export const CategoryBadge = styled.span`
  background: ${colors.secondary};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  text-transform: uppercase;
`;

export const SimilarityBadge = styled.div<{ color: string }>`
  display: inline-block;
  background: ${props => props.color};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 40px;
`;

export const EmptyState = styled.div`
  ${fontStyles.content}
  text-align: center;
  padding: ${spacing['2xl']} ${spacing.lg};
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  border: 1px dashed ${colors.borderSecondary};
  color: ${colors.textTertiary};
`;
