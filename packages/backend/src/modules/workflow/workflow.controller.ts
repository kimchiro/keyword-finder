import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { WorkflowService, WorkflowResult } from './workflow.service';

@ApiTags('Workflow', '키워드 분석 워크플로우')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('complete/:query')
  @ApiOperation({
    summary: '완전한 키워드 분석 워크플로우 실행',
    description: `
    프론트엔드 검색창에서 키워드 입력 시 실행되는 완전한 워크플로우:
    1. 네이버 API 호출 (블로그 검색 + 데이터랩 트렌드)
    2. 병렬로 Playwright 스크래핑 실행 (자동완성, 연관검색어, 인기주제, 스마트블록)
    3. 모든 데이터를 데이터베이스에 저장
    4. 키워드 분석 데이터 생성
    5. 통합된 결과를 프론트엔드에 반환
    `,
  })
  @ApiParam({
    name: 'query',
    description: '분석할 키워드',
    example: '맛집',
  })
  @ApiResponse({
    status: 200,
    description: '워크플로우 실행 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '키워드 분석 워크플로우가 성공적으로 완료되었습니다.' },
        data: {
          type: 'object',
          properties: {
            query: { type: 'string', example: '맛집' },
            naverApiData: {
              type: 'object',
              description: '네이버 API 데이터 (블로그 검색 + 데이터랩)',
            },
            scrapingData: {
              type: 'object',
              description: '스크래핑된 키워드 데이터',
            },
            analysisData: {
              type: 'object',
              description: '키워드 분석 결과',
            },
            executionTime: { type: 'number', example: 15.2 },
            timestamp: { type: 'string', example: '2025-09-21T08:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '워크플로우 실행 실패',
  })
  async executeCompleteWorkflow(@Param('query') query: string): Promise<WorkflowResult> {
    try {
      console.log(`🚀 완전한 워크플로우 API 호출: ${query}`);
      
      const result = await this.workflowService.executeCompleteWorkflow(query);
      
      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            message: result.message,
            data: result.data,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ 완전한 워크플로우 API 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '워크플로우 실행 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('quick/:query')
  @ApiOperation({
    summary: '빠른 키워드 분석',
    description: `
    스크래핑 없이 빠른 분석 수행:
    1. 네이버 API 호출 (블로그 검색 + 데이터랩)
    2. 기존 분석 데이터 조회
    3. 즉시 결과 반환 (스크래핑 제외)
    `,
  })
  @ApiParam({
    name: 'query',
    description: '분석할 키워드',
    example: '맛집',
  })
  @ApiResponse({
    status: 200,
    description: '빠른 분석 성공',
  })
  async executeQuickAnalysis(@Param('query') query: string): Promise<WorkflowResult> {
    try {
      console.log(`⚡ 빠른 분석 API 호출: ${query}`);
      
      const result = await this.workflowService.executeQuickAnalysis(query);
      
      return result;
    } catch (error) {
      console.error('❌ 빠른 분석 API 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '빠른 분석 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('scraping/:query')
  @ApiOperation({
    summary: '스크래핑 전용 워크플로우',
    description: `
    키워드 스크래핑만 수행:
    1. Playwright 기반 네이버 스크래핑
    2. 자동완성, 연관검색어, 인기주제, 스마트블록 데이터 수집
    3. 데이터베이스 저장
    4. 스크래핑 결과 반환
    `,
  })
  @ApiParam({
    name: 'query',
    description: '스크래핑할 키워드',
    example: '맛집',
  })
  @ApiResponse({
    status: 200,
    description: '스크래핑 성공',
  })
  async executeScrapingOnly(@Param('query') query: string): Promise<WorkflowResult> {
    try {
      console.log(`🕷️ 스크래핑 전용 API 호출: ${query}`);
      
      const result = await this.workflowService.executeScrapingOnly(query);
      
      return result;
    } catch (error) {
      console.error('❌ 스크래핑 전용 API 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '스크래핑 워크플로우 실행 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({
    summary: '워크플로우 상태 체크',
    description: '모든 워크플로우 구성 요소의 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상태 체크 완료',
    schema: {
      type: 'object',
      properties: {
        naverApi: { type: 'boolean', example: true },
        scraping: { type: 'boolean', example: true },
        analysis: { type: 'boolean', example: true },
        overall: { type: 'boolean', example: true },
      },
    },
  })
  async checkWorkflowHealth() {
    try {
      const healthStatus = await this.workflowService.checkWorkflowHealth();
      
      return {
        success: true,
        message: '워크플로우 상태 체크 완료',
        data: healthStatus,
      };
    } catch (error) {
      console.error('❌ 워크플로우 상태 체크 실패:', error);
      throw new HttpException(
        {
          success: false,
          message: '워크플로우 상태 체크 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
