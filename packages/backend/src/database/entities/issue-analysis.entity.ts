import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum IssueType {
  RISING = '급상승',
  STABLE = '안정',
  FALLING = '하락',
  NEW = '신규',
}

export enum TrendDirection {
  UP = '상승',
  DOWN = '하락',
  MAINTAIN = '유지',
}

@Entity('issue_analysis')
@Unique(['keyword', 'analysisDate'])
@Index(['keyword'])
@Index(['issueType'])
@Index(['analysisDate'])
export class IssueAnalysis {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ApiProperty({ description: '이슈 타입', enum: IssueType })
  @Column({
    name: 'issue_type',
    type: 'enum',
    enum: IssueType,
  })
  issueType: IssueType;

  @ApiProperty({ description: '이슈 점수' })
  @Column({ name: 'issue_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  issueScore: number;

  @ApiProperty({ description: '트렌드 방향', enum: TrendDirection })
  @Column({
    name: 'trend_direction',
    type: 'enum',
    enum: TrendDirection,
    default: TrendDirection.MAINTAIN,
  })
  trendDirection: TrendDirection;

  @ApiProperty({ description: '변동성 점수' })
  @Column({ name: 'volatility_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  volatilityScore: number;

  @ApiProperty({ description: '분석 날짜' })
  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
