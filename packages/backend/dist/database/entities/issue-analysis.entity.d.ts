import { Keyword } from './keyword.entity';
export declare enum IssueType {
    RISING = "\uAE09\uC0C1\uC2B9",
    STABLE = "\uC548\uC815",
    FALLING = "\uD558\uB77D",
    NEW = "\uC2E0\uADDC"
}
export declare enum TrendDirection {
    UP = "\uC0C1\uC2B9",
    DOWN = "\uD558\uB77D",
    MAINTAIN = "\uC720\uC9C0"
}
export declare class IssueAnalysis {
    id: number;
    keywordId: number;
    keyword: string;
    keywordEntity: Keyword;
    issueType: IssueType;
    issueScore: number;
    trendDirection: TrendDirection;
    volatilityScore: number;
    analysisDate: Date;
    createdAt: Date;
}
