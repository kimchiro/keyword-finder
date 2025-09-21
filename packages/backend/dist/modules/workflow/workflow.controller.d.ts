import { WorkflowService, WorkflowResult } from './workflow.service';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    executeCompleteWorkflow(query: string): Promise<WorkflowResult>;
    executeQuickAnalysis(query: string): Promise<WorkflowResult>;
    executeScrapingOnly(query: string): Promise<WorkflowResult>;
    checkWorkflowHealth(): Promise<{
        success: boolean;
        message: string;
        data: {
            naverApi: boolean;
            scraping: boolean;
            analysis: boolean;
            overall: boolean;
        };
    }>;
}
