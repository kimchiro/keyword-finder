// 트렌드 타입 열거형
export enum TrendType {
  RISING = 'rising',
  FALLING = 'falling',
  NEW = 'new',
  STABLE = 'stable',
  DISAPPEARED = 'disappeared'
}

// 트렌드 타입 한글 이름 매핑
export const TREND_TYPE_NAMES: Record<TrendType, string> = {
  [TrendType.RISING]: '상승',
  [TrendType.FALLING]: '하락',
  [TrendType.NEW]: '신규',
  [TrendType.STABLE]: '안정',
  [TrendType.DISAPPEARED]: '사라짐'
} as const;

// 트렌드 타입 아이콘 매핑
export const TREND_TYPE_ICONS: Record<TrendType, string> = {
  [TrendType.RISING]: '🔥',
  [TrendType.FALLING]: '📉',
  [TrendType.NEW]: '✨',
  [TrendType.STABLE]: '📊',
  [TrendType.DISAPPEARED]: '👻'
} as const;

// 트렌드 타입 색상 매핑
export const TREND_TYPE_COLORS: Record<TrendType, string> = {
  [TrendType.RISING]: '#c6f6d5',
  [TrendType.FALLING]: '#fed7d7',
  [TrendType.NEW]: '#bee3f8',
  [TrendType.STABLE]: '#e2e8f0',
  [TrendType.DISAPPEARED]: '#fbb6ce'
} as const;

// 트렌드 타입 텍스트 색상 매핑
export const TREND_TYPE_TEXT_COLORS: Record<TrendType, string> = {
  [TrendType.RISING]: '#22543d',
  [TrendType.FALLING]: '#742a2a',
  [TrendType.NEW]: '#2a4365',
  [TrendType.STABLE]: '#4a5568',
  [TrendType.DISAPPEARED]: '#702459'
} as const;
