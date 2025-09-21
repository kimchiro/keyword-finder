export declare enum PrimaryIntent {
    INFORMATIONAL = "\uC815\uBCF4\uC131",
    COMMERCIAL = "\uC0C1\uC5C5\uC131",
    MIXED = "\uD63C\uD569"
}
export declare class IntentAnalysis {
    id: number;
    keyword: string;
    informationalRatio: number;
    commercialRatio: number;
    primaryIntent: PrimaryIntent;
    confidenceScore: number;
    analysisDate: Date;
    createdAt: Date;
}
