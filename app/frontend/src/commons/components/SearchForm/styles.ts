import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '@/commons/styles';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const SearchFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
`;

export const SearchInput = styled.input`
  padding: ${spacing.md};
  border: 2px solid ${colors.borderPrimary};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.base};
  color: ${colors.textPrimary};
  background: ${colors.bgCard};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.borderFocus};
    box-shadow: 0 0 0 3px ${colors.primaryLight}33;
  }

  &:disabled {
    background-color: ${colors.bgSecondary};
    color: ${colors.textTertiary};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.textTertiary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

export const SearchButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  min-width: 180px;

  ${({ variant = 'secondary' }) => {
    if (variant === 'primary') {
      return `
        background: ${colors.primary};
        color: ${colors.textInverse};
        box-shadow: ${shadow.sm};
        
        &:hover:not(:disabled) {
          background: ${colors.primaryDark};
          transform: translateY(-2px);
          box-shadow: ${shadow.lg};
        }

        &:active {
          transform: translateY(0);
          box-shadow: ${shadow.sm};
        }
      `;
    } else {
      return `
        background: ${colors.bgCard};
        color: ${colors.textSecondary};
        border: 2px solid ${colors.borderPrimary};
        box-shadow: ${shadow.sm};
        
        &:hover:not(:disabled) {
          background: ${colors.bgSecondary};
          border-color: ${colors.borderSecondary};
          color: ${colors.textPrimary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
