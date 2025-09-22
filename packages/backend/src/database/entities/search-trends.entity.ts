import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Keyword } from './keyword.entity';

export enum PeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity('search_trends')
@Unique(['keywordId', 'periodType', 'periodValue'])
@Index(['keywordId'])
@Index(['periodType'])
@Index(['periodValue'])
@Index(['keywordId', 'periodType']) // 복합 인덱스 추가
export class SearchTrends {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드 ID' })
  @Column({ name: 'keyword_id', type: 'int' })
  keywordId: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ManyToOne(() => Keyword, (keyword) => keyword.searchTrends, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'keyword_id' })
  keywordEntity: Keyword;

  @ApiProperty({ description: '기간 타입', enum: PeriodType })
  @Column({
    name: 'period_type',
    type: 'enum',
    enum: PeriodType,
  })
  periodType: PeriodType;

  @ApiProperty({ description: '기간 값 (YYYY-MM-DD 또는 YYYY-MM)' })
  @Column({ name: 'period_value', type: 'varchar', length: 20 })
  periodValue: string;

  @ApiProperty({ description: '검색량' })
  @Column({ name: 'search_volume', type: 'bigint', default: 0 })
  searchVolume: number;

  @ApiProperty({ description: '검색 비율' })
  @Column({ name: 'search_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  searchRatio: number;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
