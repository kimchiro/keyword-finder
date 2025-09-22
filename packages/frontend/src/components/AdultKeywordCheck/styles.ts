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

export const CheckCard = styled.div<{ isAdult: boolean }>`
  background: ${props => props.isAdult ? '#fef2f2' : '#f0fdf4'};
  border: 2px solid ${props => props.isAdult ? '#fecaca' : '#bbf7d0'};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const StatusIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export const StatusLabel = styled.div<{ isAdult: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.isAdult ? '#dc2626' : '#16a34a'};
  margin-bottom: 12px;
`;

export const StatusDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
`;

export const WarningBadge = styled.div`
  display: inline-block;
  background: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const SafeBadge = styled.div`
  display: inline-block;
  background: #16a34a;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;
