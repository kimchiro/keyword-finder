import { useState } from 'react';
import axios from 'axios';
import { KeywordData } from '../../../shared/types';

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
      console.log('🔍 키워드 데이터 요청:', query);
      
      // 특정 검색어의 키워드 데이터 가져오기
      const response = await axios.get(`http://localhost:3001/api/keywords?query=${encodeURIComponent(query)}`);
      
      console.log('📦 키워드 응답:', response.data);
      
      if (response.data.success) {
        setKeywords(response.data.data);
      } else {
        throw new Error('키워드 데이터를 가져오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('❌ 키워드 모달 데이터 로딩 오류:', err);
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (err.response) {
        setError(`서버 오류: ${err.response.status} - ${err.response.data?.error || err.message}`);
      } else {
        setError('키워드 데이터를 불러오는 중 오류가 발생했습니다.');
      }
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
