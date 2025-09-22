import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionService } from '../../../../common/services/transaction.service';
import { KeywordAnalytics } from '../../../../database/entities/keyword-analytics.entity';
import { RelatedKeywords, SimilarityScore } from '../../../../database/entities/related-keywords.entity';
import { KeywordCollectionLogs, CollectionType } from '../../../../database/entities/keyword-collection-logs.entity';
import { Keyword as KeywordEntity } from '../../../../database/entities/keyword.entity';
import { Keyword, AnalysisDate } from '../value-objects';

// 키워드 데이터 접근 서비스 - 키워드 분석 데이터의 저장/조회를 담당
@Injectable()
export class KeywordDataService {
  constructor(
    @InjectRepository(KeywordAnalytics)
    private keywordAnalyticsRepository: Repository<KeywordAnalytics>,
    @InjectRepository(RelatedKeywords)
    private relatedKeywordsRepository: Repository<RelatedKeywords>,
    @InjectRepository(KeywordCollectionLogs)
    private keywordCollectionLogsRepository: Repository<KeywordCollectionLogs>,
    @InjectRepository(KeywordEntity)
    private keywordRepository: Repository<KeywordEntity>,
    private transactionService: TransactionService,
  ) {}

  // 키워드 분석 데이터 저장 - 네이버 API 결과 직접 사용
  async saveKeywordAnalytics(
    keyword: Keyword,
    analysisDate: AnalysisDate,
    naverApiData?: any,
  ): Promise<KeywordAnalytics> {
    // 네이버 API에서 이미 계산된 값들을 직접 사용
    const processedData = this.extractNaverApiData(naverApiData);

    return await this.transactionService.runInTransaction(async (queryRunner) => {
      // 먼저 Keyword 엔티티를 저장하거나 조회
      let keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).findOne({
        where: { keyword: keyword.value }
      });

      if (!keywordEntity) {
        keywordEntity = await queryRunner.manager.getRepository(KeywordEntity).save({
          keyword: keyword.value,
          status: 'active',
        });
      }
      
      const analyticsData = {
        keywordId: keywordEntity.id, // keywordId 추가
        keyword: keyword.value,
        monthlySearchPc: processedData.monthlySearchPc,
        monthlySearchMobile: processedData.monthlySearchMobile,
        monthlySearchTotal: processedData.monthlySearchTotal,
        monthlyContentBlog: processedData.monthlyContentBlog,
        monthlyContentCafe: 0,
        monthlyContentAll: processedData.monthlyContentBlog,
        estimatedSearchYesterday: 0,
        estimatedSearchEndMonth: 0,
        saturationIndexBlog: 0,
        saturationIndexCafe: 0,
        saturationIndexAll: 0,
        analysisDate: analysisDate.value,
      };

      await this.transactionService.batchUpsert(
        queryRunner,
        KeywordAnalytics,
        [analyticsData],
        ['keyword_id', 'analysis_date'], // keywordId 기준으로 upsert
        [
          'keyword', 'monthly_search_pc', 'monthly_search_mobile', 'monthly_search_total',
          'monthly_content_blog', 'monthly_content_cafe', 'monthly_content_all',
          'estimated_search_yesterday', 'estimated_search_end_month',
          'saturation_index_blog', 'saturation_index_cafe', 'saturation_index_all',
          'updated_at'
        ]
      );

      return await queryRunner.manager.getRepository(KeywordAnalytics).findOne({
        where: { keywordId: keywordEntity.id, analysisDate: analysisDate.value }
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
      // 기준 키워드 엔티티 저장하거나 조회
      let baseKeywordEntity = await queryRunner.manager.getRepository(KeywordEntity).findOne({
        where: { keyword: baseKeyword.value }
      });

      if (!baseKeywordEntity) {
        baseKeywordEntity = await queryRunner.manager.getRepository(KeywordEntity).save({
          keyword: baseKeyword.value,
          status: 'active',
        });
      }

      // 기존 연관 키워드 데이터 삭제
      await this.transactionService.batchDelete(
        queryRunner,
        RelatedKeywords,
        { baseKeywordId: baseKeywordEntity.id, analysisDate: analysisDate.value }
      );

      // 연관 키워드들도 저장하거나 조회하여 ID 매핑
      const relatedKeywords = [];
      
      for (const [index, item] of relatedKeywordsData.entries()) {
        let relatedKeywordEntity = await queryRunner.manager.getRepository(KeywordEntity).findOne({
          where: { keyword: item.keyword }
        });

        if (!relatedKeywordEntity) {
          relatedKeywordEntity = await queryRunner.manager.getRepository(KeywordEntity).save({
            keyword: item.keyword,
            status: 'active',
          });
        }

        relatedKeywords.push({
          baseKeywordId: baseKeywordEntity.id,
          relatedKeywordId: relatedKeywordEntity.id,
          baseKeyword: baseKeyword.value,
          relatedKeyword: item.keyword,
          monthlySearchVolume: item.monthlySearchVolume || 0,
          blogCumulativePosts: 0,
          similarityScore: SimilarityScore.MEDIUM,
          rankPosition: index + 1,
          analysisDate: analysisDate.value,
        });
      }

      // 배치 UPSERT (중복 키 처리)
      await this.transactionService.batchUpsert(
        queryRunner,
        RelatedKeywords,
        relatedKeywords,
        ['base_keyword_id', 'related_keyword_id', 'analysis_date'], // 중복 감지 컬럼
        ['monthly_search_volume', 'blog_cumulative_posts', 'similarity_score', 'rank_position'], // 업데이트할 컬럼
        500
      );

      // 저장된 데이터 조회하여 반환
      return await queryRunner.manager.getRepository(RelatedKeywords).find({
        where: { baseKeywordId: baseKeywordEntity.id, analysisDate: analysisDate.value },
        order: { rankPosition: 'ASC' },
      });
    });
  }

  // 키워드 분석 데이터 조회
  async findKeywordAnalytics(keyword: Keyword): Promise<KeywordAnalytics | null> {
    // 먼저 Keyword 엔티티를 조회
    const keywordEntity = await this.keywordRepository.findOne({
      where: { keyword: keyword.value }
    });

    if (!keywordEntity) {
      return null;
    }

    return await this.keywordAnalyticsRepository.findOne({
      where: { keywordId: keywordEntity.id },
      order: { analysisDate: 'DESC' },
    });
  }

  // 특정 날짜의 키워드 분석 데이터 조회
  async findKeywordAnalyticsByDate(
    keyword: Keyword,
    analysisDate: AnalysisDate,
  ): Promise<KeywordAnalytics | null> {
    // 먼저 Keyword 엔티티를 조회
    const keywordEntity = await this.keywordRepository.findOne({
      where: { keyword: keyword.value }
    });

    if (!keywordEntity) {
      return null;
    }

    return await this.keywordAnalyticsRepository.findOne({
      where: { keywordId: keywordEntity.id, analysisDate: analysisDate.value },
    });
  }

  // 연관 키워드 데이터 조회
  async findRelatedKeywords(
    keyword: Keyword,
    analysisDate: AnalysisDate,
  ): Promise<RelatedKeywords[]> {
    // 먼저 Keyword 엔티티를 조회
    const keywordEntity = await this.keywordRepository.findOne({
      where: { keyword: keyword.value }
    });

    if (!keywordEntity) {
      return [];
    }

    return await this.relatedKeywordsRepository.find({
      where: { baseKeywordId: keywordEntity.id, analysisDate: analysisDate.value },
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

  // 네이버 API 데이터에서 필요한 값들 추출
  private extractNaverApiData(naverApiData?: any): {
    monthlySearchPc: number;
    monthlySearchMobile: number;
    monthlySearchTotal: number;
    monthlyContentBlog: number;
  } {
    // 기본값
    let monthlySearchPc = 0;
    let monthlySearchMobile = 0;
    let monthlyContentBlog = 0;

    try {
      // 네이버 API에서 이미 계산된 검색량 데이터 사용
      if (naverApiData?.results) {
        // MultipleKeywordsLimitedData 형태의 응답인 경우
        const result = naverApiData.results.find((r: any) => r.keyword);
        if (result) {
          const deviceData = result.deviceData || { pc: 50, mobile: 50 };
          const totalVolume = result.monthlySearchVolume || 0;
          
          monthlySearchPc = Math.round(totalVolume * (deviceData.pc / 100));
          monthlySearchMobile = Math.round(totalVolume * (deviceData.mobile / 100));
        }
      } else if (naverApiData?.datalab?.results?.[0]?.data) {
        // SingleKeywordFullData 형태의 응답인 경우
        const datalabData = naverApiData.datalab.results[0].data;
        if (datalabData.length > 0) {
          const latestRatio = datalabData[datalabData.length - 1].ratio;
          // 50:50 비율로 가정 (실제 네이버 API에서 디바이스별 데이터 제공시 수정)
          monthlySearchPc = Math.round(latestRatio * 50);
          monthlySearchMobile = Math.round(latestRatio * 50);
        }
      }

      // 블로그 검색 결과에서 컨텐츠 수 추출
      if (naverApiData?.blogSearch?.total) {
        monthlyContentBlog = naverApiData.blogSearch.total;
      }

    } catch (error) {
      console.error('❌ 네이버 API 데이터 추출 오류:', error);
    }

    const monthlySearchTotal = monthlySearchPc + monthlySearchMobile;

    return {
      monthlySearchPc,
      monthlySearchMobile,
      monthlySearchTotal,
      monthlyContentBlog,
    };
  }

  // 스크래핑된 키워드 데이터 저장
  async saveScrapedKeywords(
    keyword: Keyword,
    analysisDate: AnalysisDate,
    scrapingData: any,
  ): Promise<void> {
    if (!scrapingData?.keywords || scrapingData.keywords.length === 0) {
      console.log('저장할 스크래핑 데이터가 없습니다.');
      return;
    }

    return await this.transactionService.runInTransaction(async (queryRunner) => {
      // 기준 키워드 엔티티 생성 또는 조회
      let baseKeywordEntity = await this.keywordRepository.findOne({
        where: { keyword: keyword.value }
      });

      if (!baseKeywordEntity) {
        baseKeywordEntity = await this.keywordRepository.save({
          keyword: keyword.value,
          status: 'active',
        });
      }

      // 기존 스크래핑 데이터 삭제 (같은 날짜)
      await queryRunner.manager.delete(KeywordCollectionLogs, {
        baseQueryId: baseKeywordEntity.id,
        collectedAt: analysisDate.value,
      });

      // 새로운 스크래핑 데이터 저장
      const collectionLogs: Partial<KeywordCollectionLogs>[] = [];

      for (const scrapedKeyword of scrapingData.keywords) {
        // 수집된 키워드 엔티티 생성 또는 조회
        let collectedKeywordEntity = await this.keywordRepository.findOne({
          where: { keyword: scrapedKeyword.keyword }
        });

        if (!collectedKeywordEntity) {
          collectedKeywordEntity = await this.keywordRepository.save({
            keyword: scrapedKeyword.keyword,
            status: 'active',
          });
        }

        // 컬렉션 타입 매핑
        let collectionType: CollectionType;
        switch (scrapedKeyword.category) {
          case 'smartblock':
            collectionType = CollectionType.SMARTBLOCK;
            break;
          case 'related_search':
            collectionType = CollectionType.RELATED_SEARCH;
            break;
          case 'trending':
            collectionType = CollectionType.TRENDING;
            break;
          default:
            continue; // 알 수 없는 카테고리는 건너뛰기
        }

        collectionLogs.push({
          baseQueryId: baseKeywordEntity.id,
          collectedKeywordId: collectedKeywordEntity.id,
          baseQuery: keyword.value,
          collectedKeyword: scrapedKeyword.keyword,
          collectionType,
          rankPosition: scrapedKeyword.rankPosition || 0,
          collectedAt: new Date(analysisDate.value),
        });
      }

      if (collectionLogs.length > 0) {
        await this.transactionService.batchUpsert(
          queryRunner,
          KeywordCollectionLogs,
          collectionLogs,
          ['base_query_id', 'collected_keyword_id', 'collection_type', 'collected_at'],
          ['rank_position'], // 업데이트할 컬럼
        );
      }

      console.log(`✅ 스크래핑 키워드 저장 완료: ${collectionLogs.length}개`);
    });
  }

  // 저장된 스크래핑 키워드 조회
  async findScrapedKeywords(keyword: Keyword): Promise<any[]> {
    const baseKeywordEntity = await this.keywordRepository.findOne({
      where: { keyword: keyword.value }
    });

    if (!baseKeywordEntity) {
      return [];
    }

    const collectionLogs = await this.keywordCollectionLogsRepository.find({
      where: { baseQueryId: baseKeywordEntity.id },
      order: { 
        collectionType: 'ASC',
        rankPosition: 'ASC',
        collectedAt: 'DESC'
      },
    });

    return collectionLogs.map(log => ({
      keyword: log.collectedKeyword,
      category: log.collectionType,
      rankPosition: log.rankPosition,
      collectedAt: log.collectedAt,
    }));
  }
}
