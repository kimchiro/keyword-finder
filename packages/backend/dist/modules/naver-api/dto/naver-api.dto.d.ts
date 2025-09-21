export declare class BlogSearchDto {
    query: string;
    display?: number;
    start?: number;
    sort?: 'sim' | 'date';
}
export declare class DatalabTrendDto {
    keyword: string;
    startDate?: string;
    endDate?: string;
    timeUnit?: 'date' | 'week' | 'month';
}
export declare class IntegratedDataDto {
    query: string;
}
export declare class BlogSearchResponseDto {
    success: boolean;
    message: string;
    data: {
        total: number;
        start: number;
        display: number;
        items: Array<{
            title: string;
            link: string;
            description: string;
            bloggername: string;
            bloggerlink: string;
            postdate: string;
        }>;
    };
}
export declare class DatalabTrendResponseDto {
    success: boolean;
    message: string;
    data: {
        startDate: string;
        endDate: string;
        timeUnit: string;
        results: Array<{
            title: string;
            keywords: string[];
            data: Array<{
                period: string;
                ratio: number;
            }>;
        }>;
    };
}
export declare class IntegratedDataResponseDto {
    success: boolean;
    message: string;
    data: {
        query: string;
        blogSearch: any;
        datalab: any;
        timestamp: string;
    };
}
