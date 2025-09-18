export interface KeywordStats {
  totalKeywords: number;
  keywordsByType: {
    autosuggest: number;
    togetherSearched: number;
    hotTopics: number;
  };
  recentQueries: string[];
  topKeywords: Array<{
    text: string;
    count: number;
  }>;
}

export interface DashboardData {
  stats: KeywordStats;
  recentSearches: Array<{
    query: string;
    timestamp: string;
    totalKeywords: number;
  }>;
}
