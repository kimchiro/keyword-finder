import styled from '@emotion/styled';

export const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

export const KeywordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const KeywordItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const KeywordRank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const KeywordText = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  min-width: 0;
  word-break: break-word;
`;

export const KeywordStats = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: #666;
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

export const SimilarityBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 40px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
`;
