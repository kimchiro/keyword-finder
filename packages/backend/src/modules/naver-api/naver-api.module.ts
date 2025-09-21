import { Module } from '@nestjs/common';
import { NaverApiController } from './naver-api.controller';
import { NaverApiService } from './naver-api.service';

@Module({
  controllers: [NaverApiController],
  providers: [NaverApiService],
  exports: [NaverApiService],
})
export class NaverApiModule {}
