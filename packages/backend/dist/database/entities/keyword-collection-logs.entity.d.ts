export declare enum CollectionType {
    TRENDING = "trending",
    SMARTBLOCK = "smartblock"
}
export declare class KeywordCollectionLogs {
    id: number;
    baseQuery: string;
    collectedKeyword: string;
    collectionType: CollectionType;
    sourcePage: string;
    rankPosition: number;
    collectedAt: Date;
}
