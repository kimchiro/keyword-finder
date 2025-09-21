import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class AnalyzeKeywordDto {
  @ApiProperty({ description: '분석할 키워드', example: '맛집' })
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty({ 
    description: '분석 날짜 (선택사항)', 
    example: '2024-01-01',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  analysisDate?: string;
}

export class KeywordAnalysisResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '분석 데이터' })
  data: {
    analytics: any;
    relatedKeywords: any[];
    chartData: {
      searchTrends: any[];
      monthlyRatios: any[];
      weekdayRatios: any[];
      genderRatios: any;
      issueAnalysis: any;
      intentAnalysis: any;
    };
  };
}

export class GetAnalysisResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '분석 결과' })
  data: {
    analytics: any;
    relatedKeywords: any[];
    chartData: any;
  };
}
