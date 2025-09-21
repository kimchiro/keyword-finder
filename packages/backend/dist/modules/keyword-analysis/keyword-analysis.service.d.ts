import { Repository } from 'typeorm';
import { KeywordAnalytics } from '../../database/entities/keyword-analytics.entity';
import { RelatedKeywords } from '../../database/entities/related-keywords.entity';
import { SearchTrends } from '../../database/entities/search-trends.entity';
import { MonthlySearchRatios } from '../../database/entities/monthly-search-ratios.entity';
import { WeekdaySearchRatios } from '../../database/entities/weekday-search-ratios.entity';
import { GenderSearchRatios } from '../../database/entities/gender-search-ratios.entity';
import { IssueAnalysis } from '../../database/entities/issue-analysis.entity';
import { IntentAnalysis } from '../../database/entities/intent-analysis.entity';
export declare class KeywordAnalysisService {
    private keywordAnalyticsRepository;
    private relatedKeywordsRepository;
    private searchTrendsRepository;
    private monthlySearchRatiosRepository;
    private weekdaySearchRatiosRepository;
    private genderSearchRatiosRepository;
    private issueAnalysisRepository;
    private intentAnalysisRepository;
    constructor(keywordAnalyticsRepository: Repository<KeywordAnalytics>, relatedKeywordsRepository: Repository<RelatedKeywords>, searchTrendsRepository: Repository<SearchTrends>, monthlySearchRatiosRepository: Repository<MonthlySearchRatios>, weekdaySearchRatiosRepository: Repository<WeekdaySearchRatios>, genderSearchRatiosRepository: Repository<GenderSearchRatios>, issueAnalysisRepository: Repository<IssueAnalysis>, intentAnalysisRepository: Repository<IntentAnalysis>);
    analyzeKeyword(keyword: string, analysisDate?: string): Promise<{
        success: boolean;
        data: {
            analytics: KeywordAnalytics;
            relatedKeywords: any[];
            chartData: {
                searchTrends: any[];
                monthlyRatios: any[];
                weekdayRatios: any[];
                genderRatios: GenderSearchRatios;
                issueAnalysis: IssueAnalysis;
                intentAnalysis: IntentAnalysis;
            };
        };
    }>;
    getKeywordAnalysis(keyword: string): Promise<{
        success: boolean;
        data: {
            analytics: KeywordAnalytics;
            relatedKeywords: RelatedKeywords[];
            chartData: {
                searchTrends: SearchTrends[];
                monthlyRatios: MonthlySearchRatios[];
                weekdayRatios: WeekdaySearchRatios[];
                genderRatios: GenderSearchRatios;
                issueAnalysis: IssueAnalysis;
                intentAnalysis: IntentAnalysis;
            };
        };
    }>;
    getAnalyzedKeywords(): Promise<any[]>;
    private generateAndSaveKeywordAnalytics;
    private generateAndSaveRelatedKeywords;
    private generateAndSaveChartData;
    private getAllChartData;
}
