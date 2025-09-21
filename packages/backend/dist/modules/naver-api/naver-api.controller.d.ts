import { NaverApiService } from './naver-api.service';
import { BlogSearchResponseDto, DatalabTrendResponseDto, IntegratedDataResponseDto } from './dto/naver-api.dto';
export declare class NaverApiController {
    private readonly naverApiService;
    constructor(naverApiService: NaverApiService);
    searchBlog(query: string, display?: number, start?: number, sort?: string): Promise<BlogSearchResponseDto>;
    getDatalabTrend(requestBody: any): Promise<DatalabTrendResponseDto>;
    getIntegratedData(query: string): Promise<IntegratedDataResponseDto>;
}
