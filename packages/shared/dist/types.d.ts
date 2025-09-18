export type KeywordType = 'autosuggest' | 'togetherSearched' | 'hotTopics';
export interface KeywordData {
    id?: number;
    query: string;
    keyword_type: KeywordType;
    text: string;
    href?: string;
    imageAlt?: string;
    rank: number;
    grp: number;
    created_at?: string;
}
export interface ScrapingOptions {
    headless: boolean;
    maxPagesPerModule: number;
    waitTimeoutMs: number;
    sleepMinMs: number;
    sleepMaxMs: number;
    outputDir: string;
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
    outputFile?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface KeywordSearchRequest {
    query: string;
    options?: Partial<ScrapingOptions>;
}
export interface KeywordStats {
    totalKeywords: number;
    keywordsByType: Record<KeywordType, number>;
    recentQueries: string[];
    topKeywords: Array<{
        text: string;
        count: number;
    }>;
}
