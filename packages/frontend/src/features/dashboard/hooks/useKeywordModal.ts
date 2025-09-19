import { useState } from 'react';
import axios from 'axios';
import { KeywordData } from '../types';

export const useKeywordModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = async (query: string) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
    setLoading(true);
    setError(null);

    try {
      // 특정 검색어의 키워드 데이터 가져오기
      const response = await axios.get(`http://localhost:3001/api/keywords?query=${encodeURIComponent(query)}`);
      
      if (response.data.success) {
        setKeywords(response.data.data);
      } else {
        throw new Error('키워드 데이터를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      setError('키워드 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuery('');
    setKeywords([]);
    setError(null);
  };

  return {
    isModalOpen,
    selectedQuery,
    keywords,
    loading,
    error,
    openModal,
    closeModal,
  };
};
