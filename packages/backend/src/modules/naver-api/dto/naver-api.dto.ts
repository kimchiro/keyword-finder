import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class BlogSearchDto {
  @ApiProperty({ description: '검색어', example: '맛집' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ 
    description: '검색 결과 개수 (1-100)', 
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  display?: number;

  @ApiProperty({ 
    description: '검색 시작 위치 (1-1000)', 
    example: 1,
    minimum: 1,
    maximum: 1000,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  start?: number;

  @ApiProperty({ 
    description: '정렬 방식 (sim: 정확도순, date: 날짜순)', 
    example: 'sim',
    enum: ['sim', 'date'],
    required: false 
  })
  @IsOptional()
  @IsString()
  sort?: 'sim' | 'date';
}

export class DatalabTrendDto {
  @ApiProperty({ description: '검색어', example: '맛집' })
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty({ 
    description: '시작 날짜 (YYYY-MM-DD)', 
    example: '2024-01-01',
    required: false 
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ 
    description: '종료 날짜 (YYYY-MM-DD)', 
    example: '2024-12-31',
    required: false 
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ 
    description: '시간 단위 (date: 일별, week: 주별, month: 월별)', 
    example: 'month',
    enum: ['date', 'week', 'month'],
    required: false 
  })
  @IsOptional()
  @IsString()
  timeUnit?: 'date' | 'week' | 'month';
}

export class IntegratedDataDto {
  @ApiProperty({ description: '검색어', example: '맛집' })
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class BlogSearchResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '검색 결과' })
  data: {
    total: number;
    start: number;
    display: number;
    items: Array<{
      title: string;
      link: string;
      description: string;
      bloggername: string;
      bloggerlink: string;
      postdate: string;
    }>;
  };
}

export class DatalabTrendResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '트렌드 데이터' })
  data: {
    startDate: string;
    endDate: string;
    timeUnit: string;
    results: Array<{
      title: string;
      keywords: string[];
      data: Array<{
        period: string;
        ratio: number;
      }>;
    }>;
  };
}

export class IntegratedDataResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '통합 데이터' })
  data: {
    query: string;
    blogSearch: any;
    datalab: any;
    timestamp: string;
  };
}
