import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordAnalysisModule } from './modules/keyword-analysis/keyword-analysis.module';
import { NaverApiModule } from './modules/naver-api/naver-api.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { HealthModule } from './modules/health/health.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM 설정
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // 기능별 모듈
    KeywordAnalysisModule,
    NaverApiModule,
    ScrapingModule,
    HealthModule,
    WorkflowModule,
  ],
})
export class AppModule {}
