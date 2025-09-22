import { Keyword } from './keyword.entity';
export declare class GenderSearchRatios {
    id: number;
    keywordId: number;
    keyword: string;
    keywordEntity: Keyword;
    maleRatio: number;
    femaleRatio: number;
    analysisDate: Date;
    createdAt: Date;
}
