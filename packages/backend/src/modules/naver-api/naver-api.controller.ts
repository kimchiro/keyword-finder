import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RateLimitGuard, NaverApiRateLimit } from '../../common/guards/rate-limit.guard';
import { NaverApiService } from './naver-api.service';
import {
  BlogSearchDto,
  DatalabTrendDto,
  IntegratedDataDto,
  BlogSearchResponseDto,
  DatalabTrendResponseDto,
  IntegratedDataResponseDto,
} from './dto/naver-api.dto';

@ApiTags('naver-api')
@Controller('naver')
@UseGuards(RateLimitGuard)
@NaverApiRateLimit(100, 60000) // 1분당 100회 제한
export class NaverApiController {
  constructor(private readonly naverApiService: NaverApiService) {}

  @Get('blog-search')
  @NaverApiRateLimit(50, 60000) // 블로그 검색은 1분당 50회로 제한
  @ApiOperation({ 
    summary: '네이버 블로그 검색',
    description: '네이버 블로그 검색 API를 통해 블로그 포스트를 검색합니다.'
  })
  @ApiQuery({ 
    name: 'query', 
    description: '검색어',
    example: '맛집'
  })
  @ApiQuery({ 
    name: 'display', 
    description: '검색 결과 개수 (1-100)',
    example: 10,
    required: false
  })
  @ApiQuery({ 
    name: 'start', 
    description: '검색 시작 위치 (1-1000)',
    example: 1,
    required: false
  })
  @ApiQuery({ 
    name: 'sort', 
    description: '정렬 방식 (sim: 정확도순, date: 날짜순)',
    example: 'sim',
    required: false
  })
  @ApiResponse({
    status: 200,
    description: '검색 성공',
    type: BlogSearchResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async searchBlog(
    @Query('query') query: string,
    @Query('display') display?: number,
    @Query('start') start?: number,
    @Query('sort') sort?: string,
  ): Promise<BlogSearchResponseDto> {
    try {
      console.log(`🔍 네이버 블로그 검색: ${query}`);
      
      const result = await this.naverApiService.searchBlogs(query, display, start, sort);

      return {
        success: true,
        message: '블로그 검색이 완료되었습니다.',
        data: result.data,
      };
    } catch (error) {
      console.error('❌ 블로그 검색 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '블로그 검색 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('datalab')
  @NaverApiRateLimit(30, 60000) // 데이터랩은 1분당 30회로 제한 (더 무거운 API)
  @ApiOperation({ 
    summary: '네이버 데이터랩 트렌드 조회',
    description: '네이버 데이터랩 API를 통해 검색 트렌드를 조회합니다.'
  })
  @ApiBody({ type: DatalabTrendDto })
  @ApiResponse({
    status: 200,
    description: '트렌드 조회 성공',
    type: DatalabTrendResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async getDatalabTrend(@Body() requestBody: any): Promise<DatalabTrendResponseDto> {
    try {
      console.log(`📈 네이버 데이터랩 트렌드 조회:`, requestBody);
      
      const result = await this.naverApiService.getDatalab(requestBody);

      return {
        success: true,
        message: '트렌드 데이터 조회가 완료되었습니다.',
        data: result.data,
      };
    } catch (error) {
      console.error('❌ 트렌드 조회 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '트렌드 조회 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('integrated-data/:query')
  @NaverApiRateLimit(20, 60000) // 통합 데이터는 1분당 20회로 제한 (가장 무거운 API)
  @ApiOperation({ 
    summary: '통합 데이터 조회',
    description: '블로그 검색과 트렌드 데이터를 통합하여 조회합니다.'
  })
  @ApiParam({ 
    name: 'query', 
    description: '검색어',
    example: '맛집'
  })
  @ApiResponse({
    status: 200,
    description: '통합 데이터 조회 성공',
    type: IntegratedDataResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async getIntegratedData(@Param('query') query: string): Promise<IntegratedDataResponseDto> {
    try {
      console.log(`📊 통합 데이터 조회: ${query}`);
      
      const result = await this.naverApiService.getIntegratedData(query);

      return {
        success: true,
        message: '통합 데이터 조회가 완료되었습니다.',
        data: result.data,
      };
    } catch (error) {
      console.error('❌ 통합 데이터 조회 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '통합 데이터 조회 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
