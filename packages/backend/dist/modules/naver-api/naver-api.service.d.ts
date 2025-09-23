import { ConfigService } from '@nestjs/config';
import { ApiRetryService } from '../../common/services/api-retry.service';
import { AppConfigService } from '../../config/app.config';
import { KeywordDataService } from '../keyword-analysis/domain/services/keyword-data.service';
import { SingleKeywordFullDataDto, MultipleKeywordsLimitedDataDto, BatchRequestDto } from './dto/naver-api.dto';
export declare class NaverApiService {
    private configService;
    private apiRetryService;
    private appConfig;
    private keywordDataService;
    constructor(configService: ConfigService, apiRetryService: ApiRetryService, appConfig: AppConfigService, keywordDataService: KeywordDataService);
    searchBlogs(query: string, display?: number, start?: number, sort?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    searchCafes(query: string, display?: number, start?: number, sort?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getDatalab(requestBody: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getIntegratedData(query: string): Promise<{
        success: boolean;
        data: {
            query: string;
            blogSearch: any;
            datalab: any;
            timestamp: string;
        };
    }>;
    getSingleKeywordFullData(request: SingleKeywordFullDataDto): Promise<{
        success: boolean;
        data: {
            keyword: string;
            blogSearch: any;
            datalab: any;
            relatedKeywords: {
                keyword: string;
                relatedKeywords: any[];
                timestamp: string;
            };
            searchPeriod: {
                startDate: string;
                endDate: string;
            };
            timestamp: string;
        };
    }>;
    getMultipleKeywordsLimitedData(request: MultipleKeywordsLimitedDataDto): Promise<{
        success: boolean;
        data: {
            keywords: string[];
            results: ({
                keyword: string;
                monthlySearchVolume: number;
                cumulativePublications: any;
            } | {
                keyword: string;
                monthlySearchVolume: number;
                cumulativePublications: number;
                error: any;
            })[];
            timestamp: string;
        };
    }>;
    processBatchRequest(request: BatchRequestDto): Promise<{
        success: boolean;
        data: {
            firstResult: {
                keyword: string;
                blogSearch: any;
                datalab: any;
                relatedKeywords: {
                    keyword: string;
                    relatedKeywords: any[];
                    timestamp: string;
                };
                searchPeriod: {
                    startDate: string;
                    endDate: string;
                };
                timestamp: string;
            };
            secondResult: {
                keywords: string[];
                results: ({
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: any;
                } | {
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: number;
                    error: any;
                })[];
                timestamp: string;
            };
            thirdResult: {
                keywords: string[];
                results: ({
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: any;
                } | {
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: number;
                    error: any;
                })[];
                timestamp: string;
            };
            totalProcessingTime: number;
            timestamp: string;
        };
    }>;
    private getRelatedKeywords;
    private processLimitedKeywordData;
    private calculateMonthlySearchVolume;
    getContentCounts(query: string): Promise<{
        success: boolean;
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
    getContentCountsAndSave(query: string): Promise<{
        success: boolean;
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
        message: string;
    }>;
    private getDateRange;
}
