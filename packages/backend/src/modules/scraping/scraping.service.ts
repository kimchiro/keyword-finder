import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '../../database/entities/keyword.entity';
import { KeywordCollectionLogs, CollectionType } from '../../database/entities/keyword-collection-logs.entity';
import { ScrapeKeywordsDto, ScrapeNaverCafeDto } from './dto/scraping.dto';
import { BrowserPoolService } from '../../common/services/browser-pool.service';
import { AppConfigService } from '../../config/app.config';
import { SCRAPING_DEFAULTS, SEARCH_VOLUME } from '../../constants/scraping.constants';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
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
      
      // 실제 Playwright 기반 스크래핑 수행 (개선된 응답 구조)
      const scrapingResult = await this.performRealScraping(query, types, maxResults);
      
      // 수집된 키워드들을 로그에 저장
      await this.saveCollectionLogs(query, scrapingResult.keywords);
      
      const executionTime = (Date.now() - startTime) / 1000;
      
      // 카테고리별 통계 계산
      const categories = scrapingResult.keywords.reduce((acc, keyword) => {
        acc[keyword.category] = (acc[keyword.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      console.log(`✅ 키워드 스크래핑 완료: ${scrapingResult.keywords.length}개, ${executionTime}초`);

      return {
        query,
        totalKeywords: scrapingResult.keywords.length,
        executionTime,
        categories,
        keywords: scrapingResult.keywords,
        collectionDetails: scrapingResult.collectionDetails, // 수집 상세 정보 추가
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
      
      // 실제 스크래핑 수행 (개선된 응답 구조)
      const scrapingResult = await scraper.scrapeAllKeywords(query, types);
      
      // maxResults 제한 적용
      const limitedKeywords = scrapingResult.keywords.slice(0, maxResults);
      
      // 데이터베이스 저장 형식으로 변환 (카테고리별 원본 순위 유지)
      const formattedKeywords = limitedKeywords.map((keyword) => ({
        keyword: keyword.keyword,
        category: keyword.category,
        rank: keyword.rank, // 스크래퍼에서 설정한 원본 순위 유지 (카테고리별 독립적)
        source: keyword.source,
        competition: keyword.competition || 'medium',
        similarity: keyword.similarity || 'medium',
      }));
      
      return {
        keywords: formattedKeywords,
        collectionDetails: scrapingResult.collectionDetails
      };
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

  /**
   * 네이버 카페 검색 결과 스크래핑
   */
  async scrapeNaverCafe(scrapeDto: ScrapeNaverCafeDto) {
    const startTime = Date.now();
    console.log(`🔍 네이버 카페 검색 스크래핑 시작: ${scrapeDto.query}`);

    try {
      const { query } = scrapeDto;
      
      // 네이버 카페 검색 스크래핑 수행
      const scrapingResult = await this.performNaverCafeScraping(query);
      
      const executionTime = (Date.now() - startTime) / 1000;

      console.log(`✅ 네이버 카페 검색 스크래핑 완료: 총 ${scrapingResult.totalPosts}개 글, ${executionTime}초`);

      return {
        query,
        totalPosts: scrapingResult.totalPosts,
        executionTime,
        searchUrl: scrapingResult.searchUrl,
      };
    } catch (error) {
      console.error('❌ ScrapingService.scrapeNaverCafe 오류:', error);
      throw error;
    }
  }

  /**
   * 네이버 카페 검색 스크래핑 수행
   */
  private async performNaverCafeScraping(query: string) {
    let session = null;
    
    try {
      // 브라우저 풀에서 세션 가져오기
      session = await this.browserPoolService.acquireBrowser();
      const { page } = session;
      
      // 네이버 카페 홈페이지로 이동
      console.log('🌐 네이버 카페 홈페이지 접속 중...');
      await page.goto('https://section.cafe.naver.com/ca-fe/home', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 검색창 찾기 및 검색어 입력
      console.log(`🔍 검색어 입력 중: ${query}`);
      const searchInput = 'div[role="search"] input[type="text"]';
      await page.waitForSelector(searchInput, { timeout: 10000 });
      await page.click(searchInput);
      await page.fill(searchInput, query);

      // 검색 버튼 클릭
      const searchButton = 'div[role="search"] button[type="submit"]';
      await page.click(searchButton);

      // 검색 결과 페이지 로딩 대기
      console.log('⏳ 검색 결과 페이지 로딩 대기 중...');
      await page.waitForSelector('.board_head', { timeout: 15000 });

      // 전체글 수 추출
      console.log('📊 전체글 수 추출 중...');
      const totalPostsElement = await page.waitForSelector('.board_head .sub_text', { timeout: 10000 });
      const totalPostsText = await totalPostsElement.textContent();
      
      // 숫자만 추출 (쉼표 제거)
      const totalPosts = parseInt(totalPostsText?.replace(/,/g, '') || '0');
      
      const searchUrl = page.url();
      
      console.log(`✅ 전체글 수 추출 완료: ${totalPosts}개`);

      return {
        totalPosts,
        searchUrl,
      };
    } catch (error) {
      console.error('❌ 네이버 카페 스크래핑 오류:', error);
      throw new Error(`네이버 카페 스크래핑 실패: ${error.message}`);
    } finally {
      if (session) {
        // 브라우저 세션을 풀에 반환
        await this.browserPoolService.releaseBrowser(session);
      }
    }
  }

  /**
   * 키워드를 찾거나 생성합니다
   */
  private async findOrCreateKeyword(keywordText: string): Promise<Keyword> {
    let keyword = await this.keywordRepository.findOne({
      where: { keyword: keywordText }
    });

    if (!keyword) {
      keyword = this.keywordRepository.create({
        keyword: keywordText,
        status: 'active'
      });
      keyword = await this.keywordRepository.save(keyword);
      console.log(`🆕 새 키워드 생성: ${keywordText} (ID: ${keyword.id})`);
    }

    return keyword;
  }

  private async saveCollectionLogs(baseQuery: string, keywords: any[]) {
    try {
      // 기준 쿼리 키워드 찾기/생성
      const baseKeyword = await this.findOrCreateKeyword(baseQuery);

      // 수집된 키워드들 처리
      const logs = [];
      for (const keyword of keywords) {
        const collectedKeyword = await this.findOrCreateKeyword(keyword.keyword);
        
        const log = this.keywordCollectionLogsRepository.create({
          baseQueryId: baseKeyword.id,
          collectedKeywordId: collectedKeyword.id,
          collectionType: keyword.category as CollectionType,
          rankPosition: keyword.rank,
        });
        
        logs.push(log);
      }

      await this.keywordCollectionLogsRepository.save(logs);
      console.log(`📝 수집 로그 저장 완료: ${logs.length}개`);
    } catch (error) {
      console.error('❌ 수집 로그 저장 실패:', error);
      // 로그 저장 실패는 전체 프로세스를 중단시키지 않음
    }
  }
}
