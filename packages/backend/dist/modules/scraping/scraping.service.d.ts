import { Repository } from 'typeorm';
import { KeywordCollectionLogs } from '../../database/entities/keyword-collection-logs.entity';
import { ScrapeKeywordsDto } from './dto/scraping.dto';
export declare class ScrapingService {
    private keywordCollectionLogsRepository;
    constructor(keywordCollectionLogsRepository: Repository<KeywordCollectionLogs>);
    scrapeKeywords(scrapeDto: ScrapeKeywordsDto): Promise<{
        query: string;
        totalKeywords: number;
        executionTime: number;
        categories: {
            [key: string]: number;
        };
        keywords: {
            keyword: string;
            category: "autosuggest" | "related" | "trending" | "smartblock";
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
    private saveCollectionLogs;
}
