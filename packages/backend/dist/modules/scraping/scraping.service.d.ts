import { Repository } from 'typeorm';
import { KeywordCollectionLogs } from '../../database/entities/keyword-collection-logs.entity';
import { ScrapeKeywordsDto } from './dto/scraping.dto';
import { BrowserPoolService } from '../../common/services/browser-pool.service';
export declare class ScrapingService {
    private keywordCollectionLogsRepository;
    private browserPoolService;
    constructor(keywordCollectionLogsRepository: Repository<KeywordCollectionLogs>, browserPoolService: BrowserPoolService);
    scrapeKeywords(scrapeDto: ScrapeKeywordsDto): Promise<{
        query: string;
        totalKeywords: number;
        executionTime: number;
        categories: {
            [key: string]: number;
        };
        keywords: {
            keyword: string;
            category: "autosuggest" | "related" | "trending" | "smartblock" | "related_search";
            rank: number;
            source: string;
            searchVolume: number;
            competition: "low" | "medium" | "high";
            similarity: "low" | "medium" | "high";
        }[];
    }>;
    getCollectionLogs(query?: string, page?: number, limit?: number): Promise<{
        logs: KeywordCollectionLogs[];
        total: number;
        page: number;
        limit: number;
    }>;
    getScrapingStats(days?: number): Promise<{
        period: string;
        dailyStats: unknown[];
        typeStats: any;
        totalKeywords: unknown;
    }>;
    private performRealScraping;
    getBrowserPoolStatus(): Promise<{
        totalInstances: number;
        activeInstances: number;
        inactiveInstances: number;
        maxPoolSize: number;
        instances: {
            id: string;
            isActive: boolean;
            lastUsed: Date;
            createdAt: Date;
            age: number;
        }[];
    }>;
    private saveCollectionLogs;
}
