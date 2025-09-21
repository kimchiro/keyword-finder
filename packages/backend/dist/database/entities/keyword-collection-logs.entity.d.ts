export declare enum CollectionType {
    TRENDING = "trending",
    SMARTBLOCK = "smartblock",
    RELATED_SEARCH = "related_search"
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
