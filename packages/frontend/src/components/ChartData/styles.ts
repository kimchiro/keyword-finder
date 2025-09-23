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

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.lg};
  border: 1px solid ${colors.borderPrimary};
`;

export const ChartTitle = styled.h3`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing.md} 0;
  text-align: center;
`;

export const ChartContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const DataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm} ${spacing.sm};
  background: ${colors.bgCard};
  border-radius: ${borderRadius.sm};
  border: 1px solid ${colors.borderPrimary};
`;

export const DataLabel = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.primary};
  font-weight: ${fontWeight.medium};
`;

export const DataValue = styled.div`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.primary};
`;

export const Badge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: ${colors.textInverse};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.lg};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  text-align: center;
`;

export const EmptyState = styled.div`
  ${fontStyles.content}
  text-align: center;
  padding: ${spacing['2xl']} ${spacing.lg};
  color: ${colors.primary};
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  
  @media (max-width: 768px) {
    height: 250px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;
