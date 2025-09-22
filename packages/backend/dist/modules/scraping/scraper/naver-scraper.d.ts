import { BrowserPoolService } from '../../../common/services/browser-pool.service';
export interface ScrapedKeyword {
    keyword: string;
    category: 'autosuggest' | 'related' | 'trending' | 'smartblock' | 'related_search';
    searchVolume?: number;
    competition?: 'low' | 'medium' | 'high';
    source: string;
    similarity?: 'low' | 'medium' | 'high';
    relatedData?: any;
}
export declare class NaverScraper {
    private browserPoolService;
    private session;
    constructor(browserPoolService: BrowserPoolService);
    initialize(): Promise<void>;
    close(): Promise<void>;
    private get page();
    scrapeTrendingKeywords(query: string): Promise<ScrapedKeyword[]>;
    scrapeSmartBlockData(query: string): Promise<ScrapedKeyword[]>;
    scrapeRelatedSearchKeywords(query: string): Promise<ScrapedKeyword[]>;
    scrapeAllKeywords(query: string, types?: string[]): Promise<ScrapedKeyword[]>;
    private estimateCompetition;
    private calculateSimilarity;
    private isValidKeyword;
    private isBlacklistedKeyword;
    private calculateSimilarityScore;
}
