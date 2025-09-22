import { Keyword } from './keyword.entity';
export declare class WeekdaySearchRatios {
    id: number;
    keywordId: number;
    keyword: string;
    keywordEntity: Keyword;
    weekdayNumber: number;
    searchRatio: number;
    analysisDate: Date;
    createdAt: Date;
}
