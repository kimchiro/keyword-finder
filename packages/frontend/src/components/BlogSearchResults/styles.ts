import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';

export const ResultsContainer = styled.div`
  margin: ${spacing.xl} 0;
`;

export const SectionTitle = styled.h3`
  ${fontStyles.title}
  margin-bottom: ${spacing.md};
`;

export const SearchResultItem = styled.div`
  padding: ${spacing.md};
  border: 1px solid ${colors.borderPrimary};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.md};
  background: ${colors.bgSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.bgTertiary};
    border-color: ${colors.secondary};
    box-shadow: ${shadow.sm};
  }
`;

export const BlogTitle = styled.h4`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  margin-bottom: ${spacing.sm};
  color: ${colors.textPrimary};
  
  a {
    color: ${colors.secondary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: ${colors.secondaryDark};
    }
  }
`;

export const BlogDescription = styled.p`
  ${fontStyles.content}
  margin-bottom: ${spacing.sm};
  line-height: 1.5;
`;

export const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${fontSize.sm};
  color: ${colors.textTertiary};
  
  a {
    color: ${colors.secondary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: ${colors.secondaryDark};
    }
  }
`;
