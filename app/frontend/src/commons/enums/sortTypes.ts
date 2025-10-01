
export enum SortType {
  RANK = 'rank',
  TEXT = 'text',
  KEYWORD_TYPE = 'keyword_type',
  CREATED_AT = 'created_at',
  TREND = 'trend'
}

// 정렬 순서 열거형
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// 정렬 타입 한글 이름 매핑
export const SORT_TYPE_NAMES: Record<SortType, string> = {
  [SortType.RANK]: '순위',
  [SortType.TEXT]: '키워드',
  [SortType.KEYWORD_TYPE]: '카테고리',
  [SortType.CREATED_AT]: '수집일',
  [SortType.TREND]: '트렌드'
} as const;
