import styled from '@emotion/styled';

export const NaverTrendContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

export const NaverTrendTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const NaverTrendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

export const NaverTrendCard = styled.div`
  padding: 0.75rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border: 1px solid #bae6fd;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`;

export const NaverTrendPeriod = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

export const NaverTrendValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
`;

export const NaverTrendEmpty = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
  font-style: italic;
`;

export const NaverTrendQueryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
`;

export const NaverTrendSummary = styled.div`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #64748b;
`;
