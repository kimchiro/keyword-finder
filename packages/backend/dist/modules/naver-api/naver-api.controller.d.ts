import { NaverApiService } from './naver-api.service';
import { BlogSearchResponseDto, DatalabTrendResponseDto, IntegratedDataResponseDto, SingleKeywordFullDataDto, MultipleKeywordsLimitedDataDto, BatchRequestDto, SingleKeywordFullDataResponseDto, MultipleKeywordsLimitedDataResponseDto, BatchResponseDto } from './dto/naver-api.dto';
export declare class NaverApiController {
    private readonly naverApiService;
    constructor(naverApiService: NaverApiService);
    searchBlog(query: string, display?: number, start?: number, sort?: string): Promise<BlogSearchResponseDto>;
    searchCafe(query: string, display?: number, start?: number, sort?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getContentCounts(query: string): Promise<{
        success: boolean;
        message: string;
        data: {
            keyword: string;
            searchedAt: Date;
            counts: {
                blogs: any;
                cafes: any;
                total: any;
            };
        };
    }>;
    saveContentCounts(body: {
        query: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            keyword: string;
            searchedAt: Date;
            counts: {
                blogs: any;
                cafes: any;
                total: any;
            };
            savedToDatabase: {
                id: number;
                analysisDate: Date;
                monthlyContentBlog: number;
                monthlyContentCafe: number;
                monthlyContentAll: number;
            };
        };
    }>;
    getDatalabTrend(requestBody: any): Promise<DatalabTrendResponseDto>;
    getIntegratedData(query: string): Promise<IntegratedDataResponseDto>;
    getSingleKeywordFullData(request: SingleKeywordFullDataDto): Promise<SingleKeywordFullDataResponseDto>;
    getMultipleKeywordsLimitedData(request: MultipleKeywordsLimitedDataDto): Promise<MultipleKeywordsLimitedDataResponseDto>;
    processBatchRequest(request: BatchRequestDto): Promise<BatchResponseDto>;
}
