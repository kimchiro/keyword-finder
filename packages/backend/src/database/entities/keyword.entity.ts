import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { KeywordAnalytics } from './keyword-analytics.entity';
import { RelatedKeywords } from './related-keywords.entity';
import { SearchTrends } from './search-trends.entity';
import { GenderSearchRatios } from './gender-search-ratios.entity';
import { MonthlySearchRatios } from './monthly-search-ratios.entity';
import { WeekdaySearchRatios } from './weekday-search-ratios.entity';
import { IntentAnalysis } from './intent-analysis.entity';
import { IssueAnalysis } from './issue-analysis.entity';
import { KeywordCollectionLogs } from './keyword-collection-logs.entity';

@Entity('keywords')
@Index(['keyword'], { unique: true })
export class Keyword {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ApiProperty({ description: '키워드 상태' })
  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  })
  status: 'active' | 'inactive' | 'archived';

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 관계 설정
  @OneToMany(() => KeywordAnalytics, (analytics) => analytics.keyword)
  analytics: KeywordAnalytics[];

  @OneToMany(() => RelatedKeywords, (related) => related.baseKeywordEntity)
  relatedKeywords: RelatedKeywords[];

  // searchTrends 관계 제거 - keyword 문자열로 직접 조회

  @OneToMany(() => GenderSearchRatios, (ratios) => ratios.keywordEntity)
  genderSearchRatios: GenderSearchRatios[];

  // monthlySearchRatios 관계 제거 - keyword 문자열로 직접 조회

  @OneToMany(() => WeekdaySearchRatios, (ratios) => ratios.keywordEntity)
  weekdaySearchRatios: WeekdaySearchRatios[];

  @OneToMany(() => IntentAnalysis, (analysis) => analysis.keywordEntity)
  intentAnalysis: IntentAnalysis[];

  @OneToMany(() => IssueAnalysis, (analysis) => analysis.keywordEntity)
  issueAnalysis: IssueAnalysis[];

  @OneToMany(() => KeywordCollectionLogs, (logs) => logs.baseQueryEntity)
  collectionLogs: KeywordCollectionLogs[];
}
