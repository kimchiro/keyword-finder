import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

/**
 * 완전한 키워드 분석 워크플로우 실행
 * 네이버 API + 스크래핑 + 키워드 분석을 병렬로 수행
 */
export const runCompleteWorkflow = async (query: string) => {
  const response = await axios.post(`${API_BASE_URL}/workflow/complete/${encodeURIComponent(query)}`);
  return response.data;
};

/**
 * 빠른 키워드 분석 워크플로우 실행
 * 네이버 API + 기존 분석 데이터 조회
 */
export const runQuickWorkflow = async (query: string) => {
  const response = await axios.post(`${API_BASE_URL}/workflow/quick/${encodeURIComponent(query)}`);
  return response.data;
};

/**
 * 스크래핑 전용 워크플로우 실행
 * 키워드 스크래핑만 수행
 */
export const runScrapingWorkflow = async (query: string) => {
  const response = await axios.post(`${API_BASE_URL}/workflow/scraping/${encodeURIComponent(query)}`);
  return response.data;
};

/**
 * 워크플로우 상태 체크
 */
export const getWorkflowHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/workflow/health`);
  return response.data;
};
