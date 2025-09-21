import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeywordCollectionLogs, CollectionType } from '../../database/entities/keyword-collection-logs.entity';
import { ScrapeKeywordsDto } from './dto/scraping.dto';
import { BrowserPoolService } from '../../common/services/browser-pool.service';
import { AppConfigService } from '../../config/app.config';
import { SCRAPING_DEFAULTS, SEARCH_VOLUME } from '../../constants/scraping.constants';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(KeywordCollectionLogs)
    private keywordCollectionLogsRepository: Repository<KeywordCollectionLogs>,
    private browserPoolService: BrowserPoolService,
    private appConfig: AppConfigService,
  ) {}

  async scrapeKeywords(scrapeDto: ScrapeKeywordsDto) {
    const startTime = Date.now();
    console.log(`🕷️ 키워드 스크래핑 시작: ${scrapeDto.query}`);

    try {
      const { 
        query, 
        types = ['related_search'], 
        maxResults = this.appConfig.scrapingMaxResults 
      } = scrapeDto;
      
      // 실제 Playwright 기반 스크래핑 수행
      const scrapedKeywords = await this.performRealScraping(query, types, maxResults);
      
      // 수집된 키워드들을 로그에 저장
      await this.saveCollectionLogs(query, scrapedKeywords);
      
      const executionTime = (Date.now() - startTime) / 1000;
      
      // 카테고리별 통계 계산
      const categories = scrapedKeywords.reduce((acc, keyword) => {
        acc[keyword.category] = (acc[keyword.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      console.log(`✅ 키워드 스크래핑 완료: ${scrapedKeywords.length}개, ${executionTime}초`);

      return {
        query,
        totalKeywords: scrapedKeywords.length,
        executionTime,
        categories,
        keywords: scrapedKeywords,
      };
    } catch (error) {
      console.error('❌ ScrapingService.scrapeKeywords 오류:', error);
      throw error;
    }
  }

  async getCollectionLogs(query?: string, page = 1, limit = 20) {
    try {
      const queryBuilder = this.keywordCollectionLogsRepository
        .createQueryBuilder('log')
        .orderBy('log.collectedAt', 'DESC');

      if (query) {
        queryBuilder.where('log.baseQuery LIKE :query OR log.collectedKeyword LIKE :query', {
          query: `%${query}%`,
        });
      }

      const [logs, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        logs,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('❌ ScrapingService.getCollectionLogs 오류:', error);
      throw error;
    }
  }

  async getScrapingStats(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await this.keywordCollectionLogsRepository
        .createQueryBuilder('log')
        .select([
          'DATE(log.collectedAt) as date',
          'log.collectionType as type',
          'COUNT(*) as count',
        ])
        .where('log.collectedAt >= :startDate', { startDate })
        .groupBy('DATE(log.collectedAt), log.collectionType')
        .orderBy('date', 'DESC')
        .getRawMany();

      // 일별 통계 집계
      const dailyStats = stats.reduce((acc, stat) => {
        const date = stat.date;
        if (!acc[date]) {
          acc[date] = { date, total: 0, types: {} };
        }
        acc[date].types[stat.type] = parseInt(stat.count);
        acc[date].total += parseInt(stat.count);
        return acc;
      }, {} as any);

      // 타입별 총 통계
      const typeStats = stats.reduce((acc, stat) => {
        acc[stat.type] = (acc[stat.type] || 0) + parseInt(stat.count);
        return acc;
      }, {} as any);

      return {
        period: `최근 ${days}일`,
        dailyStats: Object.values(dailyStats),
        typeStats,
        totalKeywords: Object.values(typeStats).reduce((sum: number, count: number) => sum + count, 0),
      };
    } catch (error) {
      console.error('❌ ScrapingService.getScrapingStats 오류:', error);
      throw error;
    }
  }

  private async performRealScraping(query: string, types: string[], maxResults: number) {
    const { NaverScraper } = await import('./scraper/naver-scraper');
    const scraper = new NaverScraper(this.browserPoolService);
    
    try {
      await scraper.initialize();
      
      // 실제 스크래핑 수행
      const scrapedKeywords = await scraper.scrapeAllKeywords(query, types);
      
      // maxResults 제한 적용
      const limitedKeywords = scrapedKeywords.slice(0, maxResults);
      
      // 데이터베이스 저장 형식으로 변환
      const formattedKeywords = limitedKeywords.map((keyword, index) => ({
        keyword: keyword.keyword,
        category: keyword.category,
        rank: index + 1,
        source: keyword.source,
        searchVolume: keyword.searchVolume || Math.floor(Math.random() * SEARCH_VOLUME.DEFAULT_RANGE.MAX) + SEARCH_VOLUME.DEFAULT_RANGE.MIN,
        competition: keyword.competition || 'medium',
        similarity: keyword.similarity || 'medium',
      }));
      
      return formattedKeywords;
    } finally {
      await scraper.close();
    }
  }

  /**
   * 브라우저 풀 상태 조회
   */
  async getBrowserPoolStatus() {
    return this.browserPoolService.getPoolStatus();
  }

  private async saveCollectionLogs(baseQuery: string, keywords: any[]) {
    try {
      const logs = keywords.map(keyword => {
        return this.keywordCollectionLogsRepository.create({
          baseQuery,
          collectedKeyword: keyword.keyword,
          collectionType: keyword.category as CollectionType,
          sourcePage: keyword.source,
          rankPosition: keyword.rank,
        });
      });

      await this.keywordCollectionLogsRepository.save(logs);
      console.log(`📝 수집 로그 저장 완료: ${logs.length}개`);
    } catch (error) {
      console.error('❌ 수집 로그 저장 실패:', error);
      // 로그 저장 실패는 전체 프로세스를 중단시키지 않음
    }
  }
}
