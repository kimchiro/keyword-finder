'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Navigation } from './Navigation';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const MainContent = styled.main`
  min-height: calc(100vh - 80px);
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Navigation />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};
