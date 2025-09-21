import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum CollectionType {
  TRENDING = 'trending',
  SMARTBLOCK = 'smartblock',
}

@Entity('keyword_collection_logs')
@Index(['baseQuery'])
@Index(['collectionType'])
@Index(['collectedAt'])
export class KeywordCollectionLogs {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '기준 검색어' })
  @Column({ name: 'base_query', type: 'varchar', length: 255 })
  baseQuery: string;

  @ApiProperty({ description: '수집된 키워드' })
  @Column({ name: 'collected_keyword', type: 'varchar', length: 255 })
  collectedKeyword: string;

  @ApiProperty({ description: '수집 타입', enum: CollectionType })
  @Column({
    name: 'collection_type',
    type: 'enum',
    enum: CollectionType,
  })
  collectionType: CollectionType;

  @ApiProperty({ description: '소스 페이지' })
  @Column({ name: 'source_page', type: 'varchar', length: 100, default: 'naver' })
  sourcePage: string;

  @ApiProperty({ description: '순위' })
  @Column({ name: 'rank_position', type: 'int', default: 0 })
  rankPosition: number;

  @ApiProperty({ description: '수집일시' })
  @CreateDateColumn({ name: 'collected_at' })
  collectedAt: Date;
}
