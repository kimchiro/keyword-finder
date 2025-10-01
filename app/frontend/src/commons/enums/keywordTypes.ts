// 키워드 타입 열거형
export enum KeywordType {
  AUTOSUGGEST = 'autosuggest',
  RELATED_KEYWORDS = 'relatedKeywords',
  TOGETHER_SEARCHED = 'togetherSearched',
  HOT_TOPICS = 'hotTopics',
  UNKNOWN = 'unknown'
}

// 키워드 타입 한글 이름 매핑
export const KEYWORD_TYPE_NAMES: Record<KeywordType, string> = {
  [KeywordType.AUTOSUGGEST]: '자동완성',
  [KeywordType.RELATED_KEYWORDS]: '연관키워드',
  [KeywordType.TOGETHER_SEARCHED]: '함께찾는',
  [KeywordType.HOT_TOPICS]: '인기주제',
  [KeywordType.UNKNOWN]: '기타'
} as const;

// 키워드 타입 전체 이름 매핑
export const KEYWORD_TYPE_FULL_NAMES: Record<KeywordType, string> = {
  [KeywordType.AUTOSUGGEST]: '자동완성 키워드',
  [KeywordType.RELATED_KEYWORDS]: '연관검색어',
  [KeywordType.TOGETHER_SEARCHED]: '함께 많이 찾는 키워드',
  [KeywordType.HOT_TOPICS]: '인기주제 키워드',
  [KeywordType.UNKNOWN]: '기타 키워드'
} as const;

// 키워드 타입 색상 매핑
export const KEYWORD_TYPE_COLORS: Record<KeywordType, string> = {
  [KeywordType.AUTOSUGGEST]: '#e6fffa',
  [KeywordType.RELATED_KEYWORDS]: '#fef5e7',
  [KeywordType.TOGETHER_SEARCHED]: '#f0fff4',
  [KeywordType.HOT_TOPICS]: '#fdf2f8',
  [KeywordType.UNKNOWN]: '#f7fafc'
} as const;

// 키워드 타입 텍스트 색상 매핑
export const KEYWORD_TYPE_TEXT_COLORS: Record<KeywordType, string> = {
  [KeywordType.AUTOSUGGEST]: '#234e52',
  [KeywordType.RELATED_KEYWORDS]: '#744210',
  [KeywordType.TOGETHER_SEARCHED]: '#22543d',
  [KeywordType.HOT_TOPICS]: '#702459',
  [KeywordType.UNKNOWN]: '#4a5568'
} as const;
