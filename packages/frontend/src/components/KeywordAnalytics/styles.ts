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

export const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 4px;
`;

export const StatUnit = styled.div`
  font-size: 11px;
  color: #888;
`;

export const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 8px;
`;

export const ProgressFill = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => Math.min(props.width, 100)}%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  z-index: 1;
`;
