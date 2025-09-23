import styled from '@emotion/styled';
import { TrendType, KeywordType } from '@/commons/enums';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';

export const TableContainer = styled.div`
  margin: ${spacing.xl} 0;
  background: ${colors.bgCard};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadow.md};
  border: 1px solid ${colors.borderPrimary};
  overflow: hidden;
`;

export const TableHeader = styled.div`
  padding: ${spacing.lg};
  background: ${colors.bgSecondary};
  border-bottom: 1px solid ${colors.borderPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.h3`
  ${fontStyles.title}
  margin: 0;
`;

export const FilterControls = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
`;

export const FilterSelect = styled.select`
  padding: ${spacing.sm};
  border: 1px solid ${colors.borderSecondary};
  border-radius: ${borderRadius.sm};
  font-size: ${fontSize.sm};
  background: ${colors.bgCard};
  color: ${colors.textPrimary};
`;

export const SearchInput = styled.input`
  padding: ${spacing.sm};
  border: 1px solid ${colors.borderSecondary};
  border-radius: ${borderRadius.sm};
  font-size: ${fontSize.sm};
  width: 200px;
  background: ${colors.bgCard};
  color: ${colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${colors.borderFocus};
  }
`;

export const StatsRow = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  background: ${colors.bgSecondary};
  border-bottom: 1px solid ${colors.borderPrimary};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.bold};
  color: ${colors.primary};
`;

export const StatLabel = styled.div`
  ${fontStyles.caption}
  margin-top: ${spacing.xs};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${colors.bgSecondary};
`;

export const TableRow = styled.tr<{ trend?: TrendType }>`
  border-bottom: 1px solid ${colors.borderPrimary};
  
  ${({ trend }) => {
    switch (trend) {
      case TrendType.RISING:
        return `background: linear-gradient(90deg, ${colors.successLight}33 0%, transparent 100%);`;
      case TrendType.FALLING:
        return `background: linear-gradient(90deg, ${colors.dangerLight}33 0%, transparent 100%);`;
      case TrendType.NEW:
        return `background: linear-gradient(90deg, ${colors.infoLight}33 0%, transparent 100%);`;
      default:
        return '';
    }
  }}
  
  &:hover {
    background: ${colors.bgSecondary};
  }
`;

export const TableHeaderCell = styled.th`
  padding: ${spacing.md};
  text-align: left;
  font-weight: ${fontWeight.semibold};
  color: ${colors.textSecondary};
  font-size: ${fontSize.sm};
  cursor: pointer;
  
  &:hover {
    background: ${colors.bgTertiary};
  }
`;

export const TableCell = styled.td`
  padding: ${spacing.md};
  font-size: ${fontSize.sm};
  color: ${colors.textPrimary};
`;

export const TrendBadge = styled.span<{ trend: TrendType }>`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  
  ${({ trend }) => {
    switch (trend) {
      case TrendType.RISING:
        return `background: ${colors.successLight}; color: ${colors.successDark};`;
      case TrendType.FALLING:
        return `background: ${colors.dangerLight}; color: ${colors.dangerDark};`;
      case TrendType.NEW:
        return `background: ${colors.infoLight}; color: ${colors.infoDark};`;
      case TrendType.STABLE:
        return `background: ${colors.gray200}; color: ${colors.gray700};`;
      case TrendType.DISAPPEARED:
        return `background: ${colors.gray300}; color: ${colors.gray800};`;
      default:
        return `background: ${colors.gray200}; color: ${colors.gray700};`;
    }
  }}
`;

export const CategoryBadge = styled.span<{ category: KeywordType }>`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  
  ${({ category }) => {
    switch (category) {
      case KeywordType.AUTOSUGGEST:
        return `background: ${colors.info}22; color: ${colors.infoDark};`;
      case KeywordType.RELATED_KEYWORDS:
        return `background: ${colors.warning}22; color: ${colors.warningDark};`;
      case KeywordType.TOGETHER_SEARCHED:
        return `background: ${colors.success}22; color: ${colors.successDark};`;
      case KeywordType.HOT_TOPICS:
        return `background: ${colors.accent}22; color: ${colors.accentDark};`;
      default:
        return `background: ${colors.gray200}; color: ${colors.gray700};`;
    }
  }}
`;

export const InsightsBanner = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);
  color: ${colors.textInverse};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

export const InsightItem = styled.div`
  font-size: ${fontSize.sm};
  opacity: 0.9;
`;
