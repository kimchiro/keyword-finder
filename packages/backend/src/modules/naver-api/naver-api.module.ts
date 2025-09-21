import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NaverApiController } from './naver-api.controller';
import { NaverApiService } from './naver-api.service';
import { CommonModule } from '../../common/common.module';
import { AppConfigService } from '../../config/app.config';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [NaverApiController],
  providers: [NaverApiService, AppConfigService],
  exports: [NaverApiService],
})
export class NaverApiModule {}
