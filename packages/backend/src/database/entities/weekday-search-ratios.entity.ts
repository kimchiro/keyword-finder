import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('weekday_search_ratios')
@Unique(['keyword', 'weekdayNumber', 'analysisDate'])
@Index(['keyword'])
@Index(['weekdayNumber'])
@Index(['analysisDate'])
@Check('"weekday_number" BETWEEN 1 AND 7')
export class WeekdaySearchRatios {
  @ApiProperty({ description: '고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '키워드' })
  @Column({ type: 'varchar', length: 255 })
  keyword: string;

  @ApiProperty({ description: '요일 (1=월요일, 7=일요일)' })
  @Column({ name: 'weekday_number', type: 'int' })
  weekdayNumber: number;

  @ApiProperty({ description: '검색 비율' })
  @Column({ name: 'search_ratio', type: 'decimal', precision: 5, scale: 2, default: 0 })
  searchRatio: number;

  @ApiProperty({ description: '분석 날짜' })
  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
