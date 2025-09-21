import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ 
    summary: '헬스체크',
    description: '애플리케이션의 상태를 확인합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '애플리케이션 정상',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 12345 },
        version: { type: 'string', example: '2.0.0' },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  async check() {
    return this.healthService.check();
  }

  @Get('database')
  @ApiOperation({ 
    summary: '데이터베이스 헬스체크',
    description: '데이터베이스 연결 상태를 확인합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '데이터베이스 연결 정상',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        database: { type: 'string', example: 'connected' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: '데이터베이스 연결 실패',
  })
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('info')
  @ApiOperation({ 
    summary: '시스템 정보',
    description: '시스템 및 애플리케이션 정보를 조회합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '시스템 정보 조회 성공',
  })
  async getInfo() {
    return this.healthService.getSystemInfo();
  }
}
