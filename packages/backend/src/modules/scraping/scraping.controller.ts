import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ScrapingService } from './scraping.service';
import {
  ScrapeKeywordsDto,
  ScrapeKeywordsResponseDto,
  GetCollectionLogsResponseDto,
  ScrapeNaverCafeDto,
  ScrapeNaverCafeResponseDto,
} from './dto/scraping.dto';

@ApiTags('scraping')
@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('scrape')
  @ApiOperation({ 
    summary: '키워드 스크래핑 실행',
    description: '네이버에서 관련 키워드들을 스크래핑합니다.'
  })
  @ApiBody({ type: ScrapeKeywordsDto })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
    type: ScrapeKeywordsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async scrapeKeywords(@Body() scrapeDto: ScrapeKeywordsDto): Promise<ScrapeKeywordsResponseDto> {
    try {
      console.log(`🕷️ 키워드 스크래핑 시작: ${scrapeDto.query}`);
      
      const result = await this.scrapingService.scrapeKeywords(scrapeDto);

      return {
        success: true,
        message: '키워드 스크래핑이 완료되었습니다.',
        data: result,
      };
    } catch (error) {
      console.error('❌ 키워드 스크래핑 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '키워드 스크래핑 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('logs')
  @ApiOperation({ 
    summary: '키워드 수집 로그 조회',
    description: '키워드 수집 이력을 조회합니다.'
  })
  @ApiQuery({ 
    name: 'query', 
    description: '검색할 키워드',
    required: false
  })
  @ApiQuery({ 
    name: 'page', 
    description: '페이지 번호',
    example: 1,
    required: false
  })
  @ApiQuery({ 
    name: 'limit', 
    description: '페이지당 개수',
    example: 20,
    required: false
  })
  @ApiResponse({
    status: 200,
    description: '로그 조회 성공',
    type: GetCollectionLogsResponseDto,
  })
  async getCollectionLogs(
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<GetCollectionLogsResponseDto> {
    try {
      console.log(`📋 키워드 수집 로그 조회: ${query || '전체'}`);
      
      const result = await this.scrapingService.getCollectionLogs(query, page, limit);

      return {
        success: true,
        message: '키워드 수집 로그를 성공적으로 조회했습니다.',
        data: result,
      };
    } catch (error) {
      console.error('❌ 키워드 수집 로그 조회 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '키워드 수집 로그 조회 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ 
    summary: '스크래핑 통계 조회',
    description: '키워드 수집 통계를 조회합니다.'
  })
  @ApiQuery({ 
    name: 'days', 
    description: '조회할 일수',
    example: 7,
    required: false
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
  })
  async getScrapingStats(@Query('days') days = 7) {
    try {
      console.log(`📊 스크래핑 통계 조회: 최근 ${days}일`);
      
      const result = await this.scrapingService.getScrapingStats(days);

      return {
        success: true,
        message: '스크래핑 통계를 성공적으로 조회했습니다.',
        data: result,
      };
    } catch (error) {
      console.error('❌ 스크래핑 통계 조회 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '스크래핑 통계 조회 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('browser-pool/status')
  @ApiOperation({ 
    summary: '브라우저 풀 상태 조회',
    description: '브라우저 풀의 현재 상태를 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '브라우저 풀 상태 조회 성공',
  })
  async getBrowserPoolStatus() {
    try {
      console.log('🏊‍♂️ 브라우저 풀 상태 조회');
      
      const result = await this.scrapingService.getBrowserPoolStatus();

      return {
        success: true,
        message: '브라우저 풀 상태를 성공적으로 조회했습니다.',
        data: result,
      };
    } catch (error) {
      console.error('❌ 브라우저 풀 상태 조회 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '브라우저 풀 상태 조회 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('naver-cafe')
  @ApiOperation({ 
    summary: '네이버 카페 검색 결과 스크래핑',
    description: '네이버 카페에서 키워드 검색 후 전체글 수를 추출합니다.'
  })
  @ApiBody({ type: ScrapeNaverCafeDto })
  @ApiResponse({
    status: 200,
    description: '네이버 카페 스크래핑 성공',
    type: ScrapeNaverCafeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async scrapeNaverCafe(@Body() scrapeDto: ScrapeNaverCafeDto): Promise<ScrapeNaverCafeResponseDto> {
    try {
      console.log(`🔍 네이버 카페 검색 스크래핑 시작: ${scrapeDto.query}`);
      
      const result = await this.scrapingService.scrapeNaverCafe(scrapeDto);

      return {
        success: true,
        message: '네이버 카페 검색 스크래핑이 완료되었습니다.',
        data: result,
      };
    } catch (error) {
      console.error('❌ 네이버 카페 검색 스크래핑 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '네이버 카페 검색 스크래핑 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
