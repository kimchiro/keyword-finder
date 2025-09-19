'use client';

import { useCallback, useMemo } from 'react';
import { KeywordData } from '../../types';

interface UseKeywordModalProps {
  keywords: KeywordData[];
  onCopy: () => void;
  onClose: () => void;
}

export const useKeywordModal = ({ keywords, onCopy, onClose }: UseKeywordModalProps) => {
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleCopy = useCallback(() => {
    const keywordText = keywords.map(keyword => 
      `[${keyword.keyword_type}] ${keyword.text} (순위: ${keyword.rank})`
    ).join('\n');
    
    navigator.clipboard.writeText(keywordText);
    onCopy();
  }, [keywords, onCopy]);

  // 키워드 타입별로 그룹화
  const groupedKeywords = useMemo(() => {
    return keywords.reduce((acc, keyword) => {
      if (!acc[keyword.keyword_type]) {
        acc[keyword.keyword_type] = [];
      }
      acc[keyword.keyword_type].push(keyword);
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
      default:
        return type;
    }
  }, []);

  return {
    handleOverlayClick,
    handleCopy,
    groupedKeywords,
    getTypeLabel,
  };
};
