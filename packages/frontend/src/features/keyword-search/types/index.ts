export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics';

export interface KeywordData {
  text: string;
  keyword_type: KeywordType;
  rank: number;
}

export interface ScrapingResult {
  success: boolean;
  data: KeywordData[];
  stats: {
    autosuggest: number;
    togetherSearched: number;
    hotTopics: number;
    total: number;
    duration: number;
  };
  error?: string;
}

export interface SearchFormData {
  query: string;
}

export interface SearchOptions {
  headless?: boolean;
  maxPagesPerModule?: number;
  saveToDb?: boolean;
}

export interface SearchState {
  loading: boolean;
  results: ScrapingResult | null;
  error: string | null;
}
