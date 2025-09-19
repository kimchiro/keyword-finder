'use client';

import { useCallback, useMemo } from 'react';
import { KeywordData } from '../../../shared/types';

interface UseKeywordModalLogicProps {
  keywords: KeywordData[];
  onCopy: () => void;
  onClose: () => void;
}

export const useKeywordModalLogic = ({ keywords, onCopy, onClose }: UseKeywordModalLogicProps) => {
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleCopy = useCallback(() => {
    const keywordText = keywords
      .filter(keyword => keyword && keyword.text && keyword.keyword_type)
      .map(keyword => 
        `[${keyword.keyword_type || 'unknown'}] ${keyword.text || 'N/A'} (순위: ${keyword.rank || 'N/A'})`
      ).join('\n');
    
    navigator.clipboard.writeText(keywordText);
    onCopy();
  }, [keywords, onCopy]);

  // 키워드 타입별로 그룹화
  const groupedKeywords = useMemo(() => {
    return keywords
      .filter(keyword => keyword && keyword.text && keyword.keyword_type) // undefined 필터링
      .reduce((acc, keyword) => {
        const type = keyword.keyword_type || 'unknown';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(keyword);
        return acc;
      }, {} as Record<string, KeywordData[]>);
  }, [keywords]);

  const getTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'autosuggest':
        return '자동완성';
      case 'together_searched':
        return '함께 많이 찾는';
      case 'hot_topics':
        return '인기주제';
      case 'relatedKeywords':
        return '연관검색어';
      case 'unknown':
        return '기타';
      default:
        return type || '알 수 없음';
    }
  }, []);

  return {
    handleOverlayClick,
    handleCopy,
    groupedKeywords,
    getTypeLabel,
  };
};
