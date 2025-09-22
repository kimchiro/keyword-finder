import { Repository, DataSource } from 'typeorm';
import { TransactionService } from '../../../../common/services/transaction.service';
import { SearchTrends } from '../../../../database/entities/search-trends.entity';
import { MonthlySearchRatios } from '../../../../database/entities/monthly-search-ratios.entity';
import { WeekdaySearchRatios } from '../../../../database/entities/weekday-search-ratios.entity';
import { GenderSearchRatios } from '../../../../database/entities/gender-search-ratios.entity';
import { IssueAnalysis } from '../../../../database/entities/issue-analysis.entity';
import { IntentAnalysis } from '../../../../database/entities/intent-analysis.entity';
import { Keyword, AnalysisDate } from '../value-objects';
export declare class ChartDataService {
    private searchTrendsRepository;
    private monthlySearchRatiosRepository;
    private weekdaySearchRatiosRepository;
    private genderSearchRatiosRepository;
    private issueAnalysisRepository;
    private intentAnalysisRepository;
    private transactionService;
    private dataSource;
    constructor(searchTrendsRepository: Repository<SearchTrends>, monthlySearchRatiosRepository: Repository<MonthlySearchRatios>, weekdaySearchRatiosRepository: Repository<WeekdaySearchRatios>, genderSearchRatiosRepository: Repository<GenderSearchRatios>, issueAnalysisRepository: Repository<IssueAnalysis>, intentAnalysisRepository: Repository<IntentAnalysis>, transactionService: TransactionService, dataSource: DataSource);
    saveChartData(keyword: Keyword, analysisDate: AnalysisDate, naverApiData?: any): Promise<{
        searchTrends: SearchTrends[];
        monthlyRatios: MonthlySearchRatios[];
        weekdayRatios: WeekdaySearchRatios[];
        genderRatios: GenderSearchRatios | null;
        issueAnalysis: IssueAnalysis | null;
        intentAnalysis: IntentAnalysis | null;
    }>;
    getChartData(keyword: Keyword, analysisDate: AnalysisDate): Promise<{
        searchTrends: SearchTrends[];
        monthlyRatios: MonthlySearchRatios[];
        weekdayRatios: WeekdaySearchRatios[];
        genderRatios: GenderSearchRatios | null;
        issueAnalysis: IssueAnalysis | null;
        intentAnalysis: IntentAnalysis | null;
    }>;
    private clearExistingChartData;
    private extractChartDataFromNaverApi;
}
