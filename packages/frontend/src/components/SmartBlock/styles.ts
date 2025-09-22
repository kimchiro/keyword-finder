import styled from '@emotion/styled';

export const SmartBlockContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const SmartBlockHeader = styled.div`
  margin-bottom: 24px;
`;

export const SmartBlockTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

export const SmartBlockScrollContainer = styled.div`
  overflow-x: auto;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const SmartBlockGrid = styled.div`
  display: flex;
  gap: 16px;
  min-width: max-content;
  padding-bottom: 8px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const SmartBlockItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  flex-shrink: 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    min-width: 220px;
    padding: 16px;
  }
`;

export const RankBadge = styled.div<{ rank: number }>`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => {
    if (props.rank <= 3) return '#ffd700'; // 금색
    if (props.rank <= 10) return '#2563eb'; // 파란색
    return '#666'; // 회색
  }};
  color: ${props => props.rank <= 3 ? '#333' : 'white'};
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

export const KeywordText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 12px 0 16px 0;
  text-align: center;
  word-break: break-word;
  line-height: 1.3;
`;

export const KeywordStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
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

export const CategoryBadge = styled.div`
  background: #2563eb;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 40px;
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

export const ScoreText = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;
