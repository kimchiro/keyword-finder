'use client';

import React from 'react';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
`;

const EmptyIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.div`
  font-size: 1.1rem;
`;

// 로딩 컴포넌트
export default function Loading() {
  return (
    <LoadingContainer>
      🔄 검색 중...
    </LoadingContainer>
  );
}

// 빈 상태 컴포넌트
export function EmptyState() {
  return (
    <EmptyStateContainer>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyMessage>
        검색어를 입력하고 검색하기 버튼을 클릭하세요
      </EmptyMessage>
    </EmptyStateContainer>
  );
}
