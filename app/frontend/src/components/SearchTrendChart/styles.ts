import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles } from '@/commons/styles';

export const Container = styled.div`
  background: ${colors.bgCard};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  box-shadow: ${shadow.md};
  margin-bottom: ${spacing.xl};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.borderPrimary};
`;

export const Title = styled.h2`
  ${fontStyles.title}
  margin: 0 0 ${spacing.lg} 0;
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.borderPrimary};
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  
  /* 차트 렌더링 최적화 */
  canvas {
    max-width: 100%;
    height: auto !important;
    image-rendering: auto;
    image-rendering: -webkit-optimize-contrast;
  }
  
  /* 반응형 높이 조정 */
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`;

export const EmptyState = styled.div`
  ${fontStyles.content}
  text-align: center;
  padding: ${spacing['2xl']} ${spacing.lg};
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  border: 1px dashed ${colors.borderSecondary};
  color: ${colors.textPrimary};
`;
