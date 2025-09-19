import React from 'react';
import styled from '@emotion/styled';
import { useNaverTrendChart } from '../hooks/useNaverTrendChart';
import { 
  NaverTrendContainer,
  NaverTrendTitle,
  NaverTrendGrid,
  NaverTrendCard,
  NaverTrendPeriod,
  NaverTrendValue,
  NaverTrendEmpty,
  NaverTrendQueryBadge,
  NaverTrendSummary
} from '../styles/NaverTrendChartStyles';
import { NaverTrendChartProps } from '../types';
import { DatalabResult } from '../../../shared/types';

const KeywordBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 0.75rem;
  margin: 0 0.25rem 0.25rem 0;
`;

export const NaverTrendChart: React.FC<NaverTrendChartProps> = ({ trendData, query }) => {
  const { formatPeriod, trendStats } = useNaverTrendChart(trendData);

  // 데이터가 없는 경우
  const hasData = trendData && (
    Array.isArray(trendData) ? trendData.length > 0 : 
    (trendData.results && trendData.results.length > 0)
  );

  if (!hasData) {
    return (
      <NaverTrendContainer>
        <NaverTrendTitle>네이버 검색 트렌드</NaverTrendTitle>
        <NaverTrendEmpty>
          {query ? `"${query}"에 대한 트렌드 데이터가 없습니다.` : '검색어를 입력하여 트렌드를 확인해보세요.'}
        </NaverTrendEmpty>
      </NaverTrendContainer>
    );
  }

  // 결과 데이터 정규화
  const results = Array.isArray(trendData) ? trendData : trendData!.results;

  return (
    <NaverTrendContainer>
      <NaverTrendTitle>네이버 검색 트렌드</NaverTrendTitle>
      {query && <NaverTrendQueryBadge>검색어: {query}</NaverTrendQueryBadge>}
      
      {trendStats && (
        <NaverTrendSummary>
          평균 검색량: {trendStats.average}% | 
          최고 검색량: {trendStats.peak?.ratio}% ({formatPeriod(trendStats.peak?.period || '')}) |
          분석 기간: {trendStats.dateRange}
        </NaverTrendSummary>
      )}

      {results.map((result: DatalabResult, index: number) => (
        <div key={index}>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>
              {result.title}
            </h4>
            <div>
              {result.keywords.map((keyword: string, keywordIndex: number) => (
                <KeywordBadge key={keywordIndex}>
                  {keyword}
                </KeywordBadge>
              ))}
            </div>
          </div>
          <NaverTrendGrid>
            {result.data.map((dataPoint, dataIndex: number) => (
              <NaverTrendCard key={dataIndex}>
                <NaverTrendPeriod>{formatPeriod(dataPoint.period)}</NaverTrendPeriod>
                <NaverTrendValue>{dataPoint.ratio}%</NaverTrendValue>
              </NaverTrendCard>
            ))}
          </NaverTrendGrid>
        </div>
      ))}
    </NaverTrendContainer>
  );
};
