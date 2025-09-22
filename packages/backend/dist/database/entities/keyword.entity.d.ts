import { KeywordAnalytics } from './keyword-analytics.entity';
import { RelatedKeywords } from './related-keywords.entity';
import { GenderSearchRatios } from './gender-search-ratios.entity';
import { WeekdaySearchRatios } from './weekday-search-ratios.entity';
import { IntentAnalysis } from './intent-analysis.entity';
import { IssueAnalysis } from './issue-analysis.entity';
import { KeywordCollectionLogs } from './keyword-collection-logs.entity';
export declare class Keyword {
    id: number;
    keyword: string;
    status: 'active' | 'inactive' | 'archived';
    createdAt: Date;
    updatedAt: Date;
    analytics: KeywordAnalytics[];
    relatedKeywords: RelatedKeywords[];
    genderSearchRatios: GenderSearchRatios[];
    weekdaySearchRatios: WeekdaySearchRatios[];
    intentAnalysis: IntentAnalysis[];
    issueAnalysis: IssueAnalysis[];
    collectionLogs: KeywordCollectionLogs[];
}
