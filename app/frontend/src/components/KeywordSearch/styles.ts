import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize } from '@/commons/styles';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl};
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);

  @media (max-width: 768px) {
    padding: ${spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${spacing.sm};
  }
`;

export const Card = styled.div`
  background: ${colors.bgCard};
  border-radius: ${borderRadius.xl};
  padding: ${spacing.xl};
  box-shadow: ${shadow.xl};
  backdrop-filter: blur(10px);
  border: 1px solid ${colors.borderPrimary};

  @media (max-width: 768px) {
    padding: ${spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${spacing.md};
  }
`;

export const Title = styled.h1`
  ${fontStyles.heading}
  text-align: center;
  margin-bottom: ${spacing.xl};
  background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: ${fontSize.xl};
  }

  @media (max-width: 480px) {
    font-size: ${fontSize.lg};
  }
`;

export const ErrorMessage = styled.div`
  background: ${colors.dangerLight}33;
  color: ${colors.dangerDark};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin: ${spacing.md} 0;
  border-left: 4px solid ${colors.danger};
`;

export const LoadingMessage = styled.div`
  ${fontStyles.body}
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.secondary};
`;

export const EmptyMessage = styled.div`
  ${fontStyles.body}
  text-align: center;
  padding: ${spacing['2xl']};
  color: ${colors.textSecondary};
  font-size: ${fontSize.lg};
`;
