import { ConfigService } from '@nestjs/config';
import { ApiRetryService } from '../../common/services/api-retry.service';
import { AppConfigService } from '../../config/app.config';
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
}
