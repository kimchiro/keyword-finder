'use client';

import { useCallback } from 'react';

export const useNaverSearchCard = () => {
  const stripHtmlTags = useCallback((html: string) => {
    return html.replace(/<[^>]*>/g, '');
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const truncateText = useCallback((text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }, []);

  return {
    stripHtmlTags,
    formatDate,
    truncateText,
  };
};
