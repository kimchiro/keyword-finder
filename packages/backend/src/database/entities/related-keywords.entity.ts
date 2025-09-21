import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum SimilarityScore {
  LOW = '낮음',
  MEDIUM = '보통',
  HIGH = '높음',
}

@Entity('related_keywords')
@Unique(['baseKeyword', 'relatedKeyword', 'analysisDate'])
@Index(['baseKeyword'])
@Index(['analysisDate'])
@Index(['rankPosition'])
@Index(['baseKeyword', 'analysisDate']) // 복합 인덱스 추가
@Index(['baseKeyword', 'rankPosition']) // 복합 인덱스 추가
export class RelatedKeywords {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '기준 키워드' })
  @Column({ name: 'base_keyword', type: 'varchar', length: 255 })
  baseKeyword: string;

  @ApiProperty({ description: '연관 키워드' })
  @Column({ name: 'related_keyword', type: 'varchar', length: 255 })
  relatedKeyword: string;

  @ApiProperty({ description: '월간 검색량' })
  @Column({ name: 'monthly_search_volume', type: 'bigint', default: 0 })
  monthlySearchVolume: number;

  @ApiProperty({ description: '블로그 누적 발행량' })
  @Column({ name: 'blog_cumulative_posts', type: 'int', default: 0 })
  blogCumulativePosts: number;

  @ApiProperty({ description: '키워드 유사도', enum: SimilarityScore })
  @Column({
    name: 'similarity_score',
    type: 'enum',
    enum: SimilarityScore,
    default: SimilarityScore.MEDIUM,
  })
  similarityScore: SimilarityScore;

  @ApiProperty({ description: '순위' })
  @Column({ name: 'rank_position', type: 'int' })
  rankPosition: number;

  @ApiProperty({ description: '분석 날짜' })
  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
