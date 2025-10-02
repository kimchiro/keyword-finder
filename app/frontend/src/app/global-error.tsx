'use client';

import React from 'react';
import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);
  padding: ${spacing.xl};
`;

const ErrorCard = styled.div`
  max-width: 600px;
  background: ${colors.bgCard};
  border-radius: ${borderRadius.xl};
  padding: ${spacing['2xl']};
  text-align: center;
  box-shadow: ${shadow.xl};
  border: 1px solid ${colors.borderPrimary};
`;

const ErrorIcon = styled.div`
  font-size: ${fontSize['4xl']};
  margin-bottom: ${spacing.lg};
`;

const ErrorTitle = styled.h1`
  ${fontStyles.heading}
  font-size: ${fontSize['3xl']};
  margin-bottom: ${spacing.lg};
  color: ${colors.danger};
`;

const ErrorMessage = styled.p`
  ${fontStyles.body}
  font-size: ${fontSize.lg};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.xl};
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin-top: ${spacing.lg};
  padding: ${spacing.md};
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.borderPrimary};
`;

const ErrorSummary = styled.summary`
  ${fontStyles.title}
  font-size: ${fontSize.base};
  cursor: pointer;
  margin-bottom: ${spacing.sm};
  color: ${colors.textPrimary};
`;

const ErrorStack = styled.pre`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  background: ${colors.bgTertiary};
  padding: ${spacing.md};
  border-radius: ${borderRadius.sm};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RetryButton = styled.button`
  padding: ${spacing.md} ${spacing.xl};
  background: ${colors.primary};
  color: ${colors.textInverse};
  border: none;
  border-radius: ${borderRadius.lg};
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${shadow.md};
  margin-top: ${spacing.lg};

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${shadow.lg};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${shadow.md};
  }
`;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error('🚨 Global Error:', error);

  return (
    <html>
      <body>
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>🚨</ErrorIcon>
            <ErrorTitle>애플리케이션 오류</ErrorTitle>
            <ErrorMessage>
              예상치 못한 오류가 발생했습니다.<br />
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </ErrorMessage>
            
            <ErrorDetails>
              <ErrorSummary>오류 상세 정보</ErrorSummary>
              <div>
                <p><strong>오류 메시지:</strong> {error.message}</p>
                {error.digest && (
                  <p><strong>오류 ID:</strong> {error.digest}</p>
                )}
                <ErrorStack>
                  {error.stack || '스택 트레이스 정보가 없습니다.'}
                </ErrorStack>
              </div>
            </ErrorDetails>

            <RetryButton onClick={reset}>
              🔄 다시 시도
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      </body>
    </html>
  );
}
