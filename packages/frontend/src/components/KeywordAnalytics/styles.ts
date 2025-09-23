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

export const Section = styled.div`
  margin-bottom: ${spacing['2xl']};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing.md} 0;
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
  padding: ${spacing.md};
  text-align: center;
  border: 1px solid ${colors.borderPrimary};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadow.lg};
    background: ${colors.bgTertiary};
  }
`;

export const StatLabel = styled.div`
  ${fontStyles.caption}
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
  font-size: ${fontSize.xs};
  color: ${colors.textTertiary};
  font-weight: ${fontWeight.medium};
`;

export const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  background: ${colors.gray200};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-top: ${spacing.sm};
`;

export const ProgressFill = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => Math.min(props.width, 100)}%;
  background: linear-gradient(90deg, ${colors.success} 0%, ${colors.successDark} 100%);
  border-radius: ${borderRadius.lg};
  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textPrimary};
  z-index: 1;
`;
