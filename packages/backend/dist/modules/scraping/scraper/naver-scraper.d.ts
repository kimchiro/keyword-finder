export interface ScrapedKeyword {
    keyword: string;
    category: 'autosuggest' | 'related' | 'trending' | 'smartblock';
    searchVolume?: number;
    competition?: 'low' | 'medium' | 'high';
    source: string;
    similarity?: 'low' | 'medium' | 'high';
    relatedData?: any;
}
export declare class NaverScraper {
    private browser;
    private page;
    initialize(): Promise<void>;
    close(): Promise<void>;
    scrapeTrendingKeywords(query: string): Promise<ScrapedKeyword[]>;
    scrapeSmartBlockData(query: string): Promise<ScrapedKeyword[]>;
    scrapeAllKeywords(query: string, types?: string[]): Promise<ScrapedKeyword[]>;
    private estimateCompetition;
    private calculateSimilarity;
}
