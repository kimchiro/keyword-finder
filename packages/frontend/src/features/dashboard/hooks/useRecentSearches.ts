import { useCallback } from 'react';

export const useRecentSearches = () => {
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return {
    formatDate,
  };
};
