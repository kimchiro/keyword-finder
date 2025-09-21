'use client';

import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroCard = styled.div`
  max-width: 800px;
  background: white;
  border-radius: 20px;
  padding: 4rem;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
`;

export default function Home() {
  return (
    <Container>
      <HeroCard>
        <Title>네이버 키워드 파인더</Title>
        <Subtitle>
          네이버 검색에서 자동완성, 함께 많이 찾는, 인기주제 키워드를<br />
          자동으로 수집하고 분석하는 도구입니다.
        </Subtitle>
        
        <ButtonGroup>
          <PrimaryButton href="/search">
            키워드 검색 시작
          </PrimaryButton>
        </ButtonGroup>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>실시간 수집</FeatureTitle>
            <FeatureDescription>
              네이버에서 실시간으로 키워드를 수집합니다
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>데이터 분석</FeatureTitle>
            <FeatureDescription>
              수집된 키워드를 체계적으로 분석합니다
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💾</FeatureIcon>
            <FeatureTitle>자동 저장</FeatureTitle>
            <FeatureDescription>
              데이터베이스에 자동으로 저장됩니다
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </HeroCard>
    </Container>
  );
}