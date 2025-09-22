import { IntentAnalysisData } from '@/commons/types';

export interface AdultKeywordCheckProps {
  keyword: string | null;
  intentAnalysis: IntentAnalysisData | null;
}
