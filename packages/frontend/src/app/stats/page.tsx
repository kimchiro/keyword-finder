'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

// Shared Chart Components
import { 
  TrendLineChart, 
  DemographicCharts, 
  KeywordAttributesChart, 
  RelatedKeywordsTable 
} from '@/shared/components/charts';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const ComingSoonCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  background: ${props => props.active ? '#667eea' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default function StatsPage() {
  const [showDemo, setShowDemo] = useState(false);

  // 샘플 데이터
  const sampleTrendData = [
    { month: '2024-01', ratio: 45 },
    { month: '2024-02', ratio: 52 },
    { month: '2024-03', ratio: 38 },
    { month: '2024-04', ratio: 67 },
    { month: '2024-05', ratio: 73 },
    { month: '2024-06', ratio: 81 },
    { month: '2024-07', ratio: 69 },
    { month: '2024-08', ratio: 58 },
    { month: '2024-09', ratio: 74 },
    { month: '2024-10', ratio: 82 },
    { month: '2024-11', ratio: 76 },
    { month: '2024-12', ratio: 85 }
  ];

  const sampleRelatedKeywords = [
    {
      relKeyword: '키워드 분석',
      monthlyPcQcCnt: 15000,
      monthlyMobileQcCnt: 25000,
      monthlyAvePcClkCnt: 1200,
      monthlyAveMobileClkCnt: 1800,
      monthlyAvePcCtr: 8.5,
      monthlyAveMobileCtr: 7.2,
      plAvgDepth: 2.3,
      compIdx: '65'
    },
    {
      relKeyword: 'SEO 도구',
      monthlyPcQcCnt: 12000,
      monthlyMobileQcCnt: 18000,
      monthlyAvePcClkCnt: 950,
      monthlyAveMobileClkCnt: 1400,
      monthlyAvePcCtr: 7.9,
      monthlyAveMobileCtr: 7.8,
      plAvgDepth: 2.1,
      compIdx: '72'
    },
    {
      relKeyword: '검색 최적화',
      monthlyPcQcCnt: 8500,
      monthlyMobileQcCnt: 14000,
      monthlyAvePcClkCnt: 680,
      monthlyAveMobileClkCnt: 1100,
      monthlyAvePcCtr: 8.0,
      monthlyAveMobileCtr: 7.9,
      plAvgDepth: 2.5,
      compIdx: '58'
    }
  ];

  return (
    <Container>
      <Header>
        <Icon>📊</Icon>
        <Title>통계 페이지</Title>
        <Subtitle>
          Shared Chart Components를 활용한 키워드 분석 통계
        </Subtitle>
        
        <div style={{ marginBottom: '2rem' }}>
          <ToggleButton 
            active={!showDemo} 
            onClick={() => setShowDemo(false)}
          >
            소개
          </ToggleButton>
          <ToggleButton 
            active={showDemo} 
            onClick={() => setShowDemo(true)}
          >
            차트 데모
          </ToggleButton>
        </div>
      </Header>

      {!showDemo ? (
        <ComingSoonCard>
          <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
            • 키워드 트렌드 분석<br />
            • 검색량 변화 추이<br />
            • 카테고리별 통계<br />
            • 시간대별 분석
          </div>

          <BackButton href="/dashboard">
            대시보드로 돌아가기
          </BackButton>
        </ComingSoonCard>
      ) : (
        <div>
          {/* 트렌드 라인 차트 */}
          <TrendLineChart 
            data={sampleTrendData}
            title="연간 키워드 검색 트렌드"
            keyword="키워드 파인더"
          />

          {/* 인구통계학적 분석 */}
          <DemographicCharts
            genderData={[
              { gender: '남성', ratio: 42 },
              { gender: '여성', ratio: 58 }
            ]}
            ageData={[
              { age: '10대', ratio: 8 },
              { age: '20대', ratio: 35 },
              { age: '30대', ratio: 28 },
              { age: '40대', ratio: 18 },
              { age: '50대', ratio: 11 }
            ]}
            deviceData={[
              { device: 'PC', ratio: 38 },
              { device: '모바일', ratio: 62 }
            ]}
            weeklyData={[
              { dayOfWeek: '월', ratio: 14 },
              { dayOfWeek: '화', ratio: 16 },
              { dayOfWeek: '수', ratio: 18 },
              { dayOfWeek: '목', ratio: 15 },
              { dayOfWeek: '금', ratio: 13 },
              { dayOfWeek: '토', ratio: 12 },
              { dayOfWeek: '일', ratio: 12 }
            ]}
          />

          {/* 키워드 속성 분석 */}
          <KeywordAttributesChart 
            data={{
              keyword: '키워드 파인더',
              issue: 68,
              information: 85,
              commercial: 52
            }}
            title="키워드 속성 분석"
          />

          {/* 연관검색어 테이블 */}
          <RelatedKeywordsTable 
            data={sampleRelatedKeywords}
            title="연관검색어 분석"
          />

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <BackButton href="/dashboard">
              대시보드로 돌아가기
            </BackButton>
          </div>
        </div>
      )}
    </Container>
  );
}
