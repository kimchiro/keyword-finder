import styled from '@emotion/styled';

export const AttributesChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  height: 400px;
  width: 100%;
  height: auto;
`;

export const AttributesChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`;

export const AttributesChartWrapper = styled.div`
  height: 320px;
  position: relative;
`;

export const AttributeInfo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

export const AttributeItem = styled.div`
  text-align: center;
`;

export const AttributeLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const AttributeValue = styled.div<{ value: number }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.value >= 70) return '#10b981'; // 높음 - 초록색
    if (props.value >= 40) return '#f59e0b'; // 중간 - 주황색
    return '#ef4444'; // 낮음 - 빨간색
  }};
`;
