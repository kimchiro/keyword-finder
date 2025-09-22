import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordAnalysisController } from './keyword-analysis.controller';
import { KeywordAnalysisService } from './keyword-analysis.service';
import { TransactionService } from '../../common/services/transaction.service';
import { AppConfigService } from '../../config/app.config';
import { Keyword } from '../../database/entities/keyword.entity';
import { KeywordAnalytics } from '../../database/entities/keyword-analytics.entity';
import { RelatedKeywords } from '../../database/entities/related-keywords.entity';
import { SearchTrends } from '../../database/entities/search-trends.entity';
import { MonthlySearchRatios } from '../../database/entities/monthly-search-ratios.entity';
import { WeekdaySearchRatios } from '../../database/entities/weekday-search-ratios.entity';
import { GenderSearchRatios } from '../../database/entities/gender-search-ratios.entity';
import { IssueAnalysis } from '../../database/entities/issue-analysis.entity';
import { IntentAnalysis } from '../../database/entities/intent-analysis.entity';
import { 
  KeywordAnalysisDomainService, 
  KeywordDataService, 
  ChartDataService 
} from './domain/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Keyword,
      KeywordAnalytics,
      RelatedKeywords,
      SearchTrends,
      MonthlySearchRatios,
      WeekdaySearchRatios,
      GenderSearchRatios,
      IssueAnalysis,
      IntentAnalysis,
    ]),
  ],
  controllers: [KeywordAnalysisController],
  providers: [
    KeywordAnalysisService,
    KeywordAnalysisDomainService,
    KeywordDataService,
    ChartDataService,
    TransactionService,
    AppConfigService,
  ],
  exports: [KeywordAnalysisService],
})
export class KeywordAnalysisModule {}
