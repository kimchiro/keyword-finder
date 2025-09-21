import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { KeywordCollectionLogs } from '../../database/entities/keyword-collection-logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeywordCollectionLogs]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
