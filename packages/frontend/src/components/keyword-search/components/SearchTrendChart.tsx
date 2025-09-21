import React from 'react';
import styled from '@emotion/styled';
import { NaverDatalabApiResponse } from '../types';

const TrendContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const TrendTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

interface SearchTrendChartProps {
  datalabResults: NaverDatalabApiResponse | null;
}

export const SearchTrendChart: React.FC<SearchTrendChartProps> = ({
  datalabResults,
}) => {
  const trendData = datalabResults?.data?.results?.[0];
  const keyword = trendData?.title || '키워드';

  if (!trendData?.data?.length) {
    return null;
  }

  return (
    <TrendContainer>
      <TrendTitle>📈 네이버 검색 트렌드 - {keyword}</TrendTitle>
      <ChartPlaceholder>
        트렌드 차트 ({trendData.data.length}개 데이터 포인트)
      </ChartPlaceholder>
    </TrendContainer>
  );
};
