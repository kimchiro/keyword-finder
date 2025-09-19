import React from 'react';
import { NaverTrendChart } from './NaverTrendChart';
import { NaverSearchCard } from './NaverSearchCard';
import { NaverResultsContainer } from '../styles/SearchBarStyles';
import { NaverResultsDisplayProps } from '../types';

export const NaverResultsDisplay: React.FC<NaverResultsDisplayProps> = ({
  searchData,
  trendData,
  currentQuery
}) => {
  if (!searchData && !trendData) {
    return null;
  }

  return (
    <NaverResultsContainer>
      <NaverTrendChart trendData={trendData} query={currentQuery} />
      <NaverSearchCard searchData={searchData} query={currentQuery} />
    </NaverResultsContainer>
  );
};
