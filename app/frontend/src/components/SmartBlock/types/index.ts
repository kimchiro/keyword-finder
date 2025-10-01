import { ScrapedKeyword } from '@/commons/types/workflow';

// SmartBlock 컴포넌트 Props 타입 (스크래핑된 키워드 데이터 사용)
export interface SmartBlockProps {
  keywords: ScrapedKeyword[] | null;
}