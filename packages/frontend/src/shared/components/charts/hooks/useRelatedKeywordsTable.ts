'use client';

import { useState, useMemo } from 'react';
import { RelatedKeyword } from '../types/index';

type SortField = keyof RelatedKeyword;
type SortDirection = 'asc' | 'desc';

interface UseRelatedKeywordsTableProps {
  data: RelatedKeyword[];
}

export const useRelatedKeywordsTable = ({ data }: UseRelatedKeywordsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('monthlyPcQcCnt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getCompetitionLevel = (compIdx: string): string => {
    const value = parseFloat(compIdx);
    if (value >= 70) return '높음';
    if (value >= 40) return '중간';
    return '낮음';
  };

  const formatCtr = (ctr: number): string => {
    return `${ctr.toFixed(2)}%`;
  };

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
    formatNumber,
    getCompetitionLevel,
    formatCtr,
  };
};
