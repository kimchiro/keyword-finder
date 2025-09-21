import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from '../../../../common/services/transaction.service';
import { KeywordAnalytics } from '../../../../database/entities/keyword-analytics.entity';
import { RelatedKeywords, SimilarityScore } from '../../../../database/entities/related-keywords.entity';
import { Keyword, AnalysisDate, SearchVolume } from '../value-objects';

// 키워드 데이터 접근 서비스 - 키워드 분석 데이터의 저장/조회를 담당
@Injectable()
export class KeywordDataService {
  constructor(
    @InjectRepository(KeywordAnalytics)
    private keywordAnalyticsRepository: Repository<KeywordAnalytics>,
    @InjectRepository(RelatedKeywords)
    private relatedKeywordsRepository: Repository<RelatedKeywords>,
    private transactionService: TransactionService,
  ) {}

  // 키워드 분석 데이터 저장
  async saveKeywordAnalytics(
    keyword: Keyword,
    analysisDate: AnalysisDate,
    searchVolume: SearchVolume,
    naverApiData?: any,
  ): Promise<KeywordAnalytics> {
    const analyticsData = {
      keyword: keyword.value,
      monthlySearchPc: searchVolume.pc,
      monthlySearchMobile: searchVolume.mobile,
      monthlySearchTotal: searchVolume.total,
      monthlyContentBlog: naverApiData?.blogSearch?.total || 0,
      monthlyContentCafe: 0,
      monthlyContentAll: naverApiData?.blogSearch?.total || 0,
      estimatedSearchYesterday: 0,
      estimatedSearchEndMonth: 0,
      saturationIndexBlog: 0,
      saturationIndexCafe: 0,
      saturationIndexAll: 0,
      analysisDate: analysisDate.value,
    };

    return await this.transactionService.runInTransaction(async (queryRunner) => {
      await this.transactionService.batchUpsert(
        queryRunner,
        KeywordAnalytics,
        [analyticsData],
        ['keyword', 'analysis_date'],
        [
          'monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total',
          'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
          'estimated_search_yesterday', 'estimated_search_end_month',
          'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
          'updated_at'
        ]
      );

      return await queryRunner.manager.getRepository(KeywordAnalytics).findOne({
        where: { keyword: keyword.value, analysisDate: analysisDate.value }
      });
    });
  }

  // 연관 키워드 데이터 저장
  async saveRelatedKeywords(
    baseKeyword: Keyword,
    analysisDate: AnalysisDate,
    relatedKeywordsData: any[],
  ): Promise<RelatedKeywords[]> {
    if (!relatedKeywordsData || relatedKeywordsData.length === 0) {
      return [];
    }

    return await this.transactionService.runInTransaction(async (queryRunner) => {
      // 기존 연관 키워드 데이터 삭제
      await this.transactionService.batchDelete(
        queryRunner,
        RelatedKeywords,
        { baseKeyword: baseKeyword.value, analysisDate: analysisDate.value }
      );

      // 새로운 연관 키워드 데이터 준비
      const relatedKeywords = relatedKeywordsData.map((item, index) => ({
        baseKeyword: baseKeyword.value,
        relatedKeyword: item.keyword,
        monthlySearchVolume: item.monthlySearchVolume || 0,
        blogCumulativePosts: 0,
        similarityScore: SimilarityScore.MEDIUM,
        rankPosition: index + 1,
        analysisDate: analysisDate.value,
      }));

      // 배치 삽입
      await this.transactionService.batchInsert(
        queryRunner,
        RelatedKeywords,
        relatedKeywords,
        500
      );

      // 저장된 데이터 조회하여 반환
      return await queryRunner.manager.getRepository(RelatedKeywords).find({
        where: { baseKeyword: baseKeyword.value, analysisDate: analysisDate.value },
        order: { rankPosition: 'ASC' },
      });
    });
  }

  // 키워드 분석 데이터 조회
  async findKeywordAnalytics(keyword: Keyword): Promise<KeywordAnalytics | null> {
    return await this.keywordAnalyticsRepository.findOne({
      where: { keyword: keyword.value },
      order: { analysisDate: 'DESC' },
    });
  }

  // 특정 날짜의 키워드 분석 데이터 조회
  async findKeywordAnalyticsByDate(
    keyword: Keyword,
    analysisDate: AnalysisDate,
  ): Promise<KeywordAnalytics | null> {
    return await this.keywordAnalyticsRepository.findOne({
      where: { keyword: keyword.value, analysisDate: analysisDate.value },
    });
  }

  // 연관 키워드 데이터 조회
  async findRelatedKeywords(
    keyword: Keyword,
    analysisDate: AnalysisDate,
  ): Promise<RelatedKeywords[]> {
    return await this.relatedKeywordsRepository.find({
      where: { baseKeyword: keyword.value, analysisDate: analysisDate.value },
      order: { rankPosition: 'ASC' },
    });
  }

  // 분석된 키워드 목록 조회
  async findAnalyzedKeywords(): Promise<any[]> {
    return await this.keywordAnalyticsRepository
      .createQueryBuilder('analytics')
      .select(['analytics.keyword', 'MAX(analytics.analysisDate) as latestDate'])
      .groupBy('analytics.keyword')
      .orderBy('latestDate', 'DESC')
      .getRawMany();
  }
}
