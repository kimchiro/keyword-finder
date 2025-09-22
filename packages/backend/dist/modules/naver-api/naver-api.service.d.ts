import { ConfigService } from '@nestjs/config';
import { ApiRetryService } from '../../common/services/api-retry.service';
import { AppConfigService } from '../../config/app.config';
import { SingleKeywordFullDataDto, MultipleKeywordsLimitedDataDto, BatchRequestDto } from './dto/naver-api.dto';
export declare class NaverApiService {
    private configService;
    private apiRetryService;
    private appConfig;
    constructor(configService: ConfigService, apiRetryService: ApiRetryService, appConfig: AppConfigService);
    searchBlogs(query: string, display?: number, start?: number, sort?: string): Promise<{
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
                genderRatio: {
                    male: number;
                    female: number;
                };
                deviceData: {
                    pc: number;
                    mobile: number;
                };
            } | {
                keyword: string;
                monthlySearchVolume: number;
                cumulativePublications: number;
                genderRatio: {
                    male: number;
                    female: number;
                };
                deviceData: {
                    pc: number;
                    mobile: number;
                };
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
                    genderRatio: {
                        male: number;
                        female: number;
                    };
                    deviceData: {
                        pc: number;
                        mobile: number;
                    };
                } | {
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: number;
                    genderRatio: {
                        male: number;
                        female: number;
                    };
                    deviceData: {
                        pc: number;
                        mobile: number;
                    };
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
                    genderRatio: {
                        male: number;
                        female: number;
                    };
                    deviceData: {
                        pc: number;
                        mobile: number;
                    };
                } | {
                    keyword: string;
                    monthlySearchVolume: number;
                    cumulativePublications: number;
                    genderRatio: {
                        male: number;
                        female: number;
                    };
                    deviceData: {
                        pc: number;
                        mobile: number;
                    };
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
    private extractGenderRatio;
    private extractDeviceData;
    private getDateRange;
}
