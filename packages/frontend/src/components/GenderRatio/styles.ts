import styled from '@emotion/styled';

export const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

export const RatioContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GenderCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const GenderIcon = styled.div<{ gender: 'male' | 'female' }>`
  font-size: 32px;
  margin-bottom: 12px;
  filter: ${props => props.gender === 'male' ? 'hue-rotate(200deg)' : 'hue-rotate(320deg)'};
`;

export const GenderLabel = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const GenderValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

export const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.width, 100)}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;
