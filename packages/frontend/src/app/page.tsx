'use client';

import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { colors, spacing, borderRadius, shadow, fontStyles, fontSize, fontWeight } from '@/commons/styles';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  padding: ${spacing['2xl']} ${spacing.xl};
  background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroCard = styled.div`
  max-width: 800px;
  background: ${colors.bgCard};
  border-radius: ${borderRadius.xl};
  padding: ${spacing['2xl']};
  text-align: center;
  box-shadow: ${shadow.xl};
  border: 1px solid ${colors.borderPrimary};
`;

const Title = styled.h1`
  font-size: ${fontSize['4xl']};
  font-weight: ${fontWeight.extrabold};
  margin-bottom: ${spacing.lg};
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  ${fontStyles.body}
  font-size: ${fontSize.lg};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing['2xl']};
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: ${spacing.md} ${spacing.xl};
  background: ${colors.primary};
  color: ${colors.textInverse};
  text-decoration: none;
  border-radius: ${borderRadius.lg};
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.lg};
  transition: all 0.2s ease;
  box-shadow: ${shadow.md};

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${shadow.lg};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.xl};
  margin-top: ${spacing['2xl']};
`;

const FeatureCard = styled.div`
  padding: ${spacing.lg};
  background: ${colors.bgSecondary};
  border-radius: ${borderRadius.lg};
  text-align: center;
  border: 1px solid ${colors.borderPrimary};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadow.md};
  }
`;

const FeatureIcon = styled.div`
  font-size: ${fontSize['3xl']};
  margin-bottom: ${spacing.md};
`;

const FeatureTitle = styled.h3`
  ${fontStyles.title}
  font-size: ${fontSize.lg};
  margin-bottom: ${spacing.sm};
`;

const FeatureDescription = styled.p`
  ${fontStyles.content}
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