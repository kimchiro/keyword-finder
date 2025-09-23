import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { SEARCH_TREND_API } from '../../../constants/api.constants';

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
    example: SEARCH_TREND_API.DEFAULT_DATE_RANGE.START_DATE,
    required: false 
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ 
    description: '종료 날짜 (YYYY-MM-DD)', 
    example: SEARCH_TREND_API.DEFAULT_DATE_RANGE.END_DATE,
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

// 배치 요청을 위한 새로운 DTO 클래스들
export class SingleKeywordFullDataDto {
  @ApiProperty({ 
    description: '검색어 (작년 어제부터 어제까지의 데이터를 자동으로 조회)', 
    example: '맛집' 
  })
  @IsString()
  @IsNotEmpty()
  keyword: string;
}

export class MultipleKeywordsLimitedDataDto {
  @ApiProperty({ 
    description: '검색어 목록 (최대 5개)', 
    example: ['맛집', '카페', '레스토랑', '음식점', '디저트'],
    maxItems: 5
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  keywords: string[];

  @ApiProperty({ 
    description: '시작 날짜 (YYYY-MM-DD)', 
    example: SEARCH_TREND_API.DEFAULT_DATE_RANGE.START_DATE,
    required: false 
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ 
    description: '종료 날짜 (YYYY-MM-DD)', 
    example: SEARCH_TREND_API.DEFAULT_DATE_RANGE.END_DATE,
    required: false 
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class BatchRequestDto {
  @ApiProperty({ description: '1번째 요청: 단일 키워드 전체 데이터' })
  firstRequest: SingleKeywordFullDataDto;

  @ApiProperty({ description: '2번째 요청: 5개 키워드 제한 데이터' })
  secondRequest: MultipleKeywordsLimitedDataDto;

  @ApiProperty({ description: '3번째 요청: 5개 키워드 제한 데이터' })
  thirdRequest: MultipleKeywordsLimitedDataDto;
}

export class SingleKeywordFullDataResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '키워드 전체 데이터' })
  data: {
    keyword: string;
    blogSearch: {
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
    datalab: any;
    relatedKeywords: any;
    searchPeriod: {
      startDate: string;
      endDate: string;
    };
    timestamp: string;
  };
}

export class MultipleKeywordsLimitedDataResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '키워드별 제한 데이터' })
  data: {
    keywords: string[];
    results: Array<{
      keyword: string;
      monthlySearchVolume: number;
      cumulativePublications: number;
    }>;
    timestamp: string;
  };
}

export class BatchResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '배치 처리 결과' })
  data: {
    firstResult: SingleKeywordFullDataResponseDto['data'];
    secondResult: MultipleKeywordsLimitedDataResponseDto['data'];
    thirdResult: MultipleKeywordsLimitedDataResponseDto['data'];
    totalProcessingTime: number;
    timestamp: string;
  };
}
