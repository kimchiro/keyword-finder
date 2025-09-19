// Re-export shared types first
export * from '../../../types/chart';

// Chart component types
import { 
  MonthlySearchRatio, 
  GenderSearchRatio, 
  AgeSearchRatio, 
  DeviceSearchRatio, 
  WeeklySearchRatio, 
  KeywordAttributes, 
  RelatedKeyword 
} from '../../../types/chart';

// 차트 공통 Props 타입들
export interface TrendLineChartProps {
  data: MonthlySearchRatio[];
  title?: string;
  keyword?: string;
}

export interface DemographicChartsProps {
  genderData: GenderSearchRatio[];
  ageData: AgeSearchRatio[];
  deviceData: DeviceSearchRatio[];
  weeklyData: WeeklySearchRatio[];
}

export interface KeywordAttributesChartProps {
  data: KeywordAttributes;
  title?: string;
}

export interface RelatedKeywordsTableProps {
  data: RelatedKeyword[];
  title?: string;
}
