import styled from '@emotion/styled';

export const SmartBlockContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

export const SmartBlockHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SmartBlockTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const SmartBlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px 24px;
`;

export const SmartBlockItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f3f4;
    border-color: #4285f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15);
  }
`;

export const KeywordText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
`;

export const CategoryBadge = styled.span`
  background: #4285f4;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;

export const ScoreText = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;
