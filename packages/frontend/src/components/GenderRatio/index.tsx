'use client';

import React from 'react';
import { GenderRatioProps } from './types';
import {
  Container,
  Title,
  RatioContainer,
  GenderCard,
  GenderIcon,
  GenderLabel,
  GenderValue,
  ProgressBar,
  ProgressFill,
} from './styles';

export const GenderRatio: React.FC<GenderRatioProps> = ({ genderRatios }) => {
  if (!genderRatios) {
    return (
      <Container>
        <Title>성별 검색 비율</Title>
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          성별 검색 비율 데이터가 없습니다.
        </div>
      </Container>
    );
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <Container>
      <Title>성별 검색 비율</Title>
      <RatioContainer>
        <GenderCard>
          <GenderIcon gender="male">👨</GenderIcon>
          <GenderLabel>남성</GenderLabel>
          <GenderValue>{formatPercentage(genderRatios.maleRatio)}</GenderValue>
          <ProgressBar>
            <ProgressFill width={genderRatios.maleRatio} color="#3b82f6" />
          </ProgressBar>
        </GenderCard>
        
        <GenderCard>
          <GenderIcon gender="female">👩</GenderIcon>
          <GenderLabel>여성</GenderLabel>
          <GenderValue>{formatPercentage(genderRatios.femaleRatio)}</GenderValue>
          <ProgressBar>
            <ProgressFill width={genderRatios.femaleRatio} color="#ec4899" />
          </ProgressBar>
        </GenderCard>
      </RatioContainer>
    </Container>
  );
};

export type { GenderRatioProps } from './types';
