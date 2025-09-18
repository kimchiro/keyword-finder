'use client';

import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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

export default function StatsPage() {
  return (
    <Container>
      <ComingSoonCard>
        <Icon>📊</Icon>
        <Title>통계 페이지</Title>
        <Subtitle>
          상세한 키워드 분석과 트렌드 통계 기능이<br />
          곧 추가될 예정입니다.
        </Subtitle>
        
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
    </Container>
  );
}
