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
export declare class SingleKeywordFullDataDto {
    keyword: string;
}
export declare class MultipleKeywordsLimitedDataDto {
    keywords: string[];
    startDate?: string;
    endDate?: string;
}
export declare class BatchRequestDto {
    firstRequest: SingleKeywordFullDataDto;
    secondRequest: MultipleKeywordsLimitedDataDto;
    thirdRequest: MultipleKeywordsLimitedDataDto;
}
export declare class SingleKeywordFullDataResponseDto {
    success: boolean;
    message: string;
    data: {
        keyword: string;
        blogSearch: {
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
        datalab: any;
        relatedKeywords: any;
        searchPeriod: {
            startDate: string;
            endDate: string;
        };
        timestamp: string;
    };
}
export declare class MultipleKeywordsLimitedDataResponseDto {
    success: boolean;
    message: string;
    data: {
        keywords: string[];
        results: Array<{
            keyword: string;
            monthlySearchVolume: number;
            cumulativePublications: number;
        }>;
        timestamp: string;
    };
}
export declare class BatchResponseDto {
    success: boolean;
    message: string;
    data: {
        firstResult: SingleKeywordFullDataResponseDto['data'];
        secondResult: MultipleKeywordsLimitedDataResponseDto['data'];
        thirdResult: MultipleKeywordsLimitedDataResponseDto['data'];
        totalProcessingTime: number;
        timestamp: string;
    };
}
