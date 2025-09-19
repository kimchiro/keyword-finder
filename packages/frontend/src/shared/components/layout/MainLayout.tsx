import React from 'react';
import { Navigation } from './Navigation';
import { LayoutContainer, MainContent } from './MainLayout.styles';

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
