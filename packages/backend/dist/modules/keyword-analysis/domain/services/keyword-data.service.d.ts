import { Repository } from 'typeorm';
import { TransactionService } from '../../../../common/services/transaction.service';
import { KeywordAnalytics } from '../../../../database/entities/keyword-analytics.entity';
import { RelatedKeywords } from '../../../../database/entities/related-keywords.entity';
import { Keyword, AnalysisDate, SearchVolume } from '../value-objects';
export declare class KeywordDataService {
    private keywordAnalyticsRepository;
    private relatedKeywordsRepository;
    private transactionService;
    constructor(keywordAnalyticsRepository: Repository<KeywordAnalytics>, relatedKeywordsRepository: Repository<RelatedKeywords>, transactionService: TransactionService);
    saveKeywordAnalytics(keyword: Keyword, analysisDate: AnalysisDate, searchVolume: SearchVolume, naverApiData?: any): Promise<KeywordAnalytics>;
    saveRelatedKeywords(baseKeyword: Keyword, analysisDate: AnalysisDate, relatedKeywordsData: any[]): Promise<RelatedKeywords[]>;
    findKeywordAnalytics(keyword: Keyword): Promise<KeywordAnalytics | null>;
    findKeywordAnalyticsByDate(keyword: Keyword, analysisDate: AnalysisDate): Promise<KeywordAnalytics | null>;
    findRelatedKeywords(keyword: Keyword, analysisDate: AnalysisDate): Promise<RelatedKeywords[]>;
    findAnalyzedKeywords(): Promise<any[]>;
}
