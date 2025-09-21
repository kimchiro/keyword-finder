import { NaverApiService } from '../naver-api/naver-api.service';
import { ScrapingService } from '../scraping/scraping.service';
import { KeywordAnalysisService } from '../keyword-analysis/keyword-analysis.service';
export interface WorkflowResult {
    success: boolean;
    data: {
        query: string;
        naverApiData: any;
        scrapingData: any;
        analysisData: any;
        executionTime: number;
        timestamp: string;
    };
    message: string;
}
export declare class WorkflowService {
    private readonly naverApiService;
    private readonly scrapingService;
    private readonly keywordAnalysisService;
    constructor(naverApiService: NaverApiService, scrapingService: ScrapingService, keywordAnalysisService: KeywordAnalysisService);
    executeCompleteWorkflow(query: string): Promise<WorkflowResult>;
    executeQuickAnalysis(query: string): Promise<WorkflowResult>;
    executeScrapingOnly(query: string): Promise<WorkflowResult>;
    checkWorkflowHealth(): Promise<{
        naverApi: boolean;
        scraping: boolean;
        analysis: boolean;
        overall: boolean;
    }>;
}
