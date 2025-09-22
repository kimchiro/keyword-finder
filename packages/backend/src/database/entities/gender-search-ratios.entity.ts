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

@Entity('gender_search_ratios')
@Unique(['keywordId', 'analysisDate'])
@Index(['keywordId'])
@Index(['analysisDate'])
export class GenderSearchRatios {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드 ID' })
  @Column({ name: 'keyword_id', type: 'int' })
  keywordId: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ManyToOne(() => Keyword, (keyword) => keyword.genderSearchRatios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'keyword_id' })
  keywordEntity: Keyword;

  @ApiProperty({ description: '남성 검색 비율' })
  @Column({ name: 'male_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  maleRatio: number;

  @ApiProperty({ description: '여성 검색 비율' })
  @Column({ name: 'female_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  femaleRatio: number;

  @ApiProperty({ description: '분석 날짜' })
  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
