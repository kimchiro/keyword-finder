import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum PrimaryIntent {
  INFORMATIONAL = '정보성',
  COMMERCIAL = '상업성',
  MIXED = '혼합',
}

@Entity('intent_analysis')
@Unique(['keyword', 'analysisDate'])
@Index(['keyword'])
@Index(['primaryIntent'])
@Index(['analysisDate'])
export class IntentAnalysis {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ApiProperty({ description: '정보성 비율' })
  @Column({ name: 'informational_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  informationalRatio: number;

  @ApiProperty({ description: '상업성 비율' })
  @Column({ name: 'commercial_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  commercialRatio: number;

  @ApiProperty({ description: '주요 의도', enum: PrimaryIntent })
  @Column({
    name: 'primary_intent',
    type: 'enum',
    enum: PrimaryIntent,
    default: PrimaryIntent.MIXED,
  })
  primaryIntent: PrimaryIntent;

  @ApiProperty({ description: '신뢰도 점수' })
  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  confidenceScore: number;

  @ApiProperty({ description: '분석 날짜' })
  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
