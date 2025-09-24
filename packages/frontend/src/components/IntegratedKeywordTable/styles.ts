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

export const Header = styled.div`
  margin-bottom: ${spacing.xl};
`;

export const Title = styled.h2`
  ${fontStyles.title}
  margin: 0 0 ${spacing.lg} 0;
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.borderPrimary};
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  padding: ${spacing.lg};
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.borderPrimary};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  min-width: 150px;
`;

export const FilterLabel = styled.label`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textSecondary};
`;

export const FilterSelect = styled.select`
  padding: ${spacing.sm};
  border: 1px solid ${colors.borderPrimary};
  border-radius: ${borderRadius.sm};
  background: ${colors.bgCard};
  color: ${colors.textPrimary};
  font-size: ${fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${colors.primary}20;
  }
`;

export const FilterCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
`;

export const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${fontSize.sm};
  color: ${colors.textPrimary};
  cursor: pointer;
  
  input {
    margin: 0;
  }
`;

export const FilterActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: flex-end;
`;

export const ResetButton = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background: ${colors.gray200};
  color: ${colors.textSecondary};
  border: 1px solid ${colors.borderPrimary};
  border-radius: ${borderRadius.sm};
  font-size: ${fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.gray300};
    color: ${colors.textPrimary};
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  padding: ${spacing.sm} 0;
`;

export const StatsText = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

export const SortSelect = styled.select`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.borderPrimary};
  border-radius: ${borderRadius.sm};
  background: ${colors.bgCard};
  color: ${colors.textPrimary};
  font-size: ${fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
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
  background: ${colors.bgCard};
  min-width: 800px;
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

export const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: ${spacing.md} ${spacing.lg};
  text-align: left;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textSecondary};
  border-bottom: 2px solid ${colors.borderPrimary};
  white-space: nowrap;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    background: ${props => props.sortable ? colors.gray100 : 'transparent'};
  }
  
  &:first-of-type {
    width: 80px;
    text-align: center;
  }
  
  &:nth-of-type(2) {
    min-width: 200px;
  }
  
  &:nth-of-type(3) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-of-type(4) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-of-type(5) {
    width: 100px;
    text-align: center;
  }
  
  &:nth-of-type(6) {
    width: 100px;
    text-align: center;
  }
  
  &:nth-of-type(7) {
    width: 120px;
    text-align: center;
  }
  
  &:nth-of-type(8) {
    width: 120px;
    text-align: center;
  }
`;

export const TableCell = styled.td<{ align?: 'left' | 'center' | 'right' }>`
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${fontSize.sm};
  color: ${colors.textPrimary};
  vertical-align: middle;
  text-align: ${props => props.align || 'left'};
`;

export const RankBadge = styled.div<{ rank: number }>`
  background: ${props => {
    if (props.rank <= 3) return colors.warning;
    if (props.rank <= 10) return colors.secondary;
    return colors.gray500;
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

export const SourceBadge = styled.div<{ source: 'smartblock' | 'related' }>`
  background: ${props => props.source === 'smartblock' ? colors.primary : colors.success};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 60px;
  display: inline-block;
`;

export const CategoryBadge = styled.div`
  background: ${colors.secondary};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 40px;
`;

export const CompetitionBadge = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  background: ${props => {
    switch (props.level) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray500;
    }
  }};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.xl};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 50px;
  display: inline-block;
`;

export const SimilarityBadge = styled.div<{ level: 'low' | 'medium' | 'high' }>`
  background: ${props => {
    switch (props.level) {
      case 'high': return colors.success;
      case 'medium': return colors.warning;
      case 'low': return colors.danger;
      default: return colors.gray500;
    }
  }};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.xl};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
  min-width: 50px;
  display: inline-block;
`;

export const VolumeText = styled.div`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  color: ${colors.textPrimary};
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

export const SortIcon = styled.span<{ direction?: 'asc' | 'desc' }>`
  margin-left: ${spacing.xs};
  font-size: ${fontSize.xs};
  color: ${colors.textTertiary};
  
  &::after {
    content: ${props => {
      if (props.direction === 'asc') return '"↑"';
      if (props.direction === 'desc') return '"↓"';
      return '"↕"';
    }};
  }
`;
