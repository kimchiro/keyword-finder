import styled from '@emotion/styled';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow, fontStyles } from '@/commons/styles';

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
  margin: 0 0 ${spacing.lg} 0;
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.borderPrimary};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  padding: ${spacing.lg};
  text-align: center;
  border: 1px solid ${colors.borderPrimary};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadow.lg};
    background: ${colors.bgTertiary};
  }
`;

export const StatLabel = styled.div`
  ${fontStyles.content}
  margin-bottom: ${spacing.sm};
  font-weight: ${fontWeight.medium};
`;

export const StatValue = styled.div`
  font-size: ${fontSize['2xl']};
  font-weight: ${fontWeight.bold};
  color: ${colors.primary};
  margin-bottom: ${spacing.xs};
`;

export const StatUnit = styled.div`
  ${fontStyles.caption}
  font-weight: ${fontWeight.medium};
`;
