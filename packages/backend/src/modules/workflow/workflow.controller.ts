import {
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { WorkflowService, WorkflowResult } from './workflow.service';

@ApiTags('Workflow', '키워드 분석 워크플로우')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('complete/:query')
  @ApiOperation({
    summary: '키워드 분석 워크플로우 실행',
    description: `
    단순화된 키워드 분석 워크플로우:
    1. 스크래핑 실행 (smartblock, related_search)
    2. 스크래핑 데이터 DB 저장 (카테고리 분류, rank 없음)
    3. 네이버 API 1개 키워드 데이터 수집
    4. 통합 결과 반환
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
        data: {
          type: 'object',
          properties: {
            query: { type: 'string', example: '맛집' },
            scrapingData: { type: 'object', description: '스크래핑 결과 데이터' },
            naverApiData: { type: 'object', description: '네이버 API 결과 데이터' },
            executionTime: { type: 'number', example: 5.2 },
            timestamp: { type: 'string', example: '2025-09-23T12:00:00.000Z' },
          },
        },
        message: { type: 'string', example: '키워드 "맛집" 분석이 완료되었습니다.' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  async executeCompleteWorkflow(@Param('query') query: string): Promise<WorkflowResult> {
    try {
      console.log(`🎯 워크플로우 요청: ${query}`);
      
      if (!query || query.trim().length === 0) {
        throw new HttpException(
          {
            success: false,
            message: '키워드를 입력해주세요.',
            error: 'INVALID_QUERY',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.workflowService.executeCompleteWorkflow(query.trim());
      
      console.log(`✅ 워크플로우 응답: ${query} - ${result.success ? '성공' : '실패'}`);
      
      return result;
    } catch (error) {
      console.error('❌ 워크플로우 컨트롤러 오류:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
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

  @Get('health')
  @ApiOperation({
    summary: '워크플로우 상태 체크',
    description: '워크플로우의 모든 의존 서비스 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상태 체크 완료',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        services: {
          type: 'object',
          properties: {
            naverApi: { type: 'boolean', example: true },
            scraping: { type: 'boolean', example: true },
            keywordAnalysis: { type: 'boolean', example: true },
          },
        },
        message: { type: 'string', example: '모든 서비스가 정상 작동 중입니다.' },
      },
    },
  })
  async checkHealth() {
    try {
      console.log('🔍 워크플로우 상태 체크 요청');
      
      const healthStatus = await this.workflowService.checkWorkflowHealth();
      
      console.log('✅ 워크플로우 상태 체크 완료:', healthStatus.success);
      
      return healthStatus;
    } catch (error) {
      console.error('❌ 워크플로우 상태 체크 오류:', error);
      
      throw new HttpException(
        {
          success: false,
          services: {
            naverApi: false,
            scraping: false,
            keywordAnalysis: false,
          },
          message: '상태 체크 중 오류가 발생했습니다.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}