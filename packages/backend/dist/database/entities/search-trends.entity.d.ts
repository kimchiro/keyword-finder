export declare enum PeriodType {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare class SearchTrends {
    id: number;
    keyword: string;
    periodType: PeriodType;
    periodValue: string;
    searchVolume: number;
    searchRatio: number;
    createdAt: Date;
}
