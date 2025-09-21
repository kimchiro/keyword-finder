import { ConfigService } from '@nestjs/config';
export declare class NaverApiService {
    private configService;
    private readonly naverClientId;
    private readonly naverClientSecret;
    constructor(configService: ConfigService);
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
